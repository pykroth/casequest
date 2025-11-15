// Complete Calendar.jsx - Copy this entire file
import React, { useState, useRef, useEffect } from 'react'
import { supabase } from '../../config/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { 
  Sparkles, 
  LogOut, 
  Send, 
  Upload, 
  Camera, 
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
  Clock
} from 'lucide-react'

export default function CalendarPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [events, setEvents] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const messagesEndRef = useRef(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    setMessages([
      {
        role: 'assistant',
        content: 'Hi! I can help you manage your academic calendar. You can:\n\n• Upload syllabus PDFs\n• Take photos of deadlines\n• Tell me about assignments\n• Connect your email\n\nWhat would you like to do?'
      }
    ])
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const parseTextForDeadlines = (text) => {
    console.log('Parsing text:', text)
    const deadlines = []
    const currentYear = new Date().getFullYear()
    
    // Check if it's JSON data
    try {
      const jsonData = JSON.parse(text)
      if (jsonData.tasks && jsonData.weekly_topics) {
        // Parse syllabus JSON format
        jsonData.tasks.forEach(task => {
          if (task.week_number && jsonData.weekly_topics) {
            const weekInfo = jsonData.weekly_topics.find(w => w.week === task.week_number)
            if (weekInfo && weekInfo.dates) {
              // Extract last date from "Mon, Oct 6; Wed, Oct 8" format
              const dateMatch = weekInfo.dates.match(/([A-Za-z]+)\s+(\d+)(?!.*\d)/)
              if (dateMatch) {
                const month = {
                  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
                  jul: 6, aug: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11
                }[dateMatch[1].toLowerCase().substring(0, 4)]
                
                if (month !== undefined) {
                  const day = parseInt(dateMatch[2])
                  const localDate = new Date(currentYear, month, day)
                  const dateStr = localDate.toISOString().split('T')[0]
                  
                  deadlines.push({
                    title: task.title,
                    date: dateStr,
                    type: task.type.toLowerCase(),
                    course: jsonData.course_name || ''
                  })
                }
              }
            }
          }
        })
        
        console.log('Final deadlines found:', deadlines)
        return deadlines
      }
    } catch (e) {
      // Not JSON, continue with regex parsing
    }
    
    // Month names mapping
    const months = {
      jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2,
      apr: 3, april: 3, may: 4, jun: 5, june: 5,
      jul: 6, july: 6, aug: 7, august: 7, sep: 8, september: 8,
      oct: 9, october: 9, nov: 10, november: 10, dec: 11, december: 11
    }
    
    // Patterns to match - order matters!
    const patterns = [
      // "assignment 5/20" or "quiz 12/15" - numeric date format
      {
        regex: /(.+?)\s*(\d{1,2})\/(\d{1,2})/gi,
        extract: (match) => {
          const title = match[1].trim()
          const month = parseInt(match[2]) - 1 // JS months are 0-indexed
          const day = parseInt(match[3])
          
          let type = 'assignment'
          const titleLower = title.toLowerCase()
          if (titleLower.includes('exam') || titleLower.includes('test')) type = 'exam'
          else if (titleLower.includes('quiz')) type = 'quiz'
          else if (titleLower.includes('project')) type = 'project'
          
          return { title, type, month, day }
        }
      },
      // "anything exam/quiz/etc on/due Month Day"
      {
        regex: /(.+?)\s*(exam|quiz|test|assignment|project|homework|paper|essay|midterm|final)\s+(?:on|due|by)\s+([a-z]+)\s+(\d{1,2})/gi,
        extract: (match) => ({
          title: `${match[1].trim()} ${match[2]}`,
          type: match[2].toLowerCase(),
          month: match[3].toLowerCase(),
          day: parseInt(match[4])
        })
      },
      // "exam/quiz/etc on/due Month Day"
      {
        regex: /(exam|quiz|test|assignment|project|homework|paper|essay|midterm|final)\s+(?:on|due|by)\s+([a-z]+)\s+(\d{1,2})/gi,
        extract: (match) => ({
          title: match[1].charAt(0).toUpperCase() + match[1].slice(1),
          type: match[1].toLowerCase(),
          month: match[2].toLowerCase(),
          day: parseInt(match[3])
        })
      },
      // "anything due/on Month Day"
      {
        regex: /(.+?)\s+(?:due|on|by)\s+([a-z]+)\s+(\d{1,2})/gi,
        extract: (match) => ({
          title: match[1].trim(),
          type: 'assignment',
          month: match[2].toLowerCase(),
          day: parseInt(match[3])
        })
      }
    ]
    
    patterns.forEach(({ regex, extract }) => {
      let match
      while ((match = regex.exec(text)) !== null) {
        console.log('Regex matched:', match)
        const data = extract(match)
        console.log('Extracted data:', data)
        
        // Determine type from title if not already specific
        const titleLower = data.title.toLowerCase()
        if (data.type === 'assignment') {
          if (titleLower.includes('exam') || titleLower.includes('test') || titleLower.includes('midterm') || titleLower.includes('final')) {
            data.type = 'exam'
          } else if (titleLower.includes('quiz')) {
            data.type = 'quiz'
          } else if (titleLower.includes('project') || titleLower.includes('presentation')) {
            data.type = 'project'
          }
        }
        
        // Normalize type names
        if (['test', 'midterm', 'final'].includes(data.type)) {
          data.type = 'exam'
        } else if (['homework', 'paper', 'essay'].includes(data.type)) {
          data.type = 'assignment'
        }
        
        // Get month number - handle both string months and numeric months
        let month = data.month
        if (typeof month === 'string') {
          month = months[month.toLowerCase()]
        }
        
        if (month !== undefined && data.day >= 1 && data.day <= 31) {
          // Create local date to avoid timezone issues
          const localDate = new Date(currentYear, month, data.day)
          const dateStr = localDate.toISOString().split('T')[0]
          
          // Avoid duplicates
          if (!deadlines.some(d => d.date === dateStr && d.title.toLowerCase() === data.title.toLowerCase())) {
            deadlines.push({
              title: data.title.charAt(0).toUpperCase() + data.title.slice(1),
              date: dateStr,
              type: data.type,
              course: ''
            })
          }
        }
      }
    })
    
    console.log('Final deadlines found:', deadlines)
    return deadlines
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const message = {
      role: 'user',
      content: `📄 Uploaded: ${file.name}`
    }
    setMessages(prev => [...prev, message])
    setLoading(true)

    try {
      let text = ''
      
      if (file.type === 'application/pdf') {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '⚠️ PDF parsing requires backend processing. For now, try copying and pasting the syllabus text or describing the deadlines to me!'
        }])
        setLoading(false)
        return
      } else if (file.type.startsWith('image/')) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '⚠️ Image OCR requires backend processing. For now, try typing out the deadlines or pasting the text!'
        }])
        setLoading(false)
        return
      } else {
        // Text file
        text = await file.text()
      }

      const deadlines = parseTextForDeadlines(text)
      
      if (deadlines.length > 0) {
        setEvents(prev => [...prev, ...deadlines])
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `✅ Found ${deadlines.length} deadline${deadlines.length > 1 ? 's' : ''}!\n\n${deadlines.map(d => `• ${d.title} - ${new Date(d.date).toLocaleDateString()}`).join('\n')}\n\nAll added to your calendar!`
        }])
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '❌ No deadlines found in that file. Try describing them to me instead!'
        }])
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Error processing file. Please try again or describe the deadlines to me.'
      }])
      console.error('File processing error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput('')
    setLoading(true)

    // Add realistic delay
    await new Promise(resolve => setTimeout(resolve, 800))

    try {
      // First, try to extract deadlines from the message
      const deadlines = parseTextForDeadlines(currentInput)
      
      if (deadlines.length > 0) {
        setEvents(prev => [...prev, ...deadlines])
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `✅ Added ${deadlines.length} deadline${deadlines.length > 1 ? 's' : ''} to your calendar!\n\n${deadlines.map(d => `• ${d.title} - ${new Date(d.date).toLocaleDateString()}`).join('\n')}`
        }])
      } else {
        // If no deadlines, give helpful response
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'I can help you add deadlines! Try telling me something like:\n\n• "Math exam on December 15"\n• "History essay due November 20"\n• "Quiz on Nov 30"\n\nJust include the assignment name and date!'
        }])
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }])
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    return days
  }

  const getEventsForDay = (day) => {
    if (!day) return []
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return events.filter(event => event.date === dateStr)
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const deleteEvent = (eventToDelete) => {
    setEvents(prev => prev.filter(e => e !== eventToDelete))
  }

  const typeColors = {
    assignment: 'bg-blue-100 text-blue-700 border-blue-300',
    exam: 'bg-red-100 text-red-700 border-red-300',
    quiz: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    project: 'bg-purple-100 text-purple-700 border-purple-300'
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">BAYMAX</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 flex flex-col h-[calc(100vh-180px)]">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                AI Assistant
              </h2>
              <p className="text-sm text-gray-600 mt-1">Describe your assignments or paste syllabus text</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2 mb-3">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".txt,.pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all cursor-pointer text-sm"
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </label>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm">
                  <Camera className="w-4 h-4" />
                  Photo
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm">
                  <Mail className="w-4 h-4" />
                  Email
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Try: 'Math exam on December 15, Essay due Nov 20'"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={loading}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={previousMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {dayNames.map(day => (
                <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {getDaysInMonth(currentDate).map((day, index) => {
                const dayEvents = getEventsForDay(day)
                const isToday = day === new Date().getDate() &&
                  currentDate.getMonth() === new Date().getMonth() &&
                  currentDate.getFullYear() === new Date().getFullYear()
                
                return (
                  <div
                    key={index}
                    className={`min-h-[80px] p-1 rounded-lg border ${
                      day
                        ? 'border-gray-200 hover:border-blue-300 cursor-pointer transition-all'
                        : 'border-transparent'
                    } ${isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'}`}
                  >
                    {day && (
                      <>
                        <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                          {day}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.map((event, i) => (
                            <div
                              key={i}
                              className={`text-[10px] px-1 py-0.5 rounded border ${typeColors[event.type] || typeColors.assignment} truncate`}
                              title={event.title}
                            >
                              {event.title}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>

            {events.length > 0 ? (
              <div className="mt-6 space-y-2 max-h-[200px] overflow-y-auto">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  All Deadlines
                </h3>
                {events
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .map((event, i) => (
                    <div key={i} className={`flex items-center justify-between p-2 rounded-lg border ${typeColors[event.type] || typeColors.assignment}`}>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{event.title}</div>
                        <div className="text-xs opacity-75">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          {event.course && ` • ${event.course}`}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteEvent(event)}
                        className="ml-2 p-1 hover:bg-white/50 rounded transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">No deadlines yet</h3>
                    <p className="text-sm text-gray-600">
                      Try typing: "Math exam December 15" or "Essay due November 20"
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}