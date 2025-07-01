"use client"

import { useState, useEffect } from "react"
import { Button } from "./components/ui/button"
import { Textarea } from "./components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"
import { Alert, AlertDescription } from "./components/ui/alert"
import { Badge } from "./components/ui/badge"
import { Loader2, Database, Sparkles, Code2, Moon, Sun } from "lucide-react"
import "./App.css"

function App() {
  const [question, setQuestion] = useState("")
  const [sql, setSql] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [results, setResults] = useState([])
  const [darkMode, setDarkMode] = useState(false)

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      setDarkMode(true)
      document.documentElement.classList.add("dark")
    } else {
      setDarkMode(false)
      document.documentElement.classList.remove("dark")
    }
  }, [])

  // Toggle theme
  const toggleTheme = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)

    if (newDarkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  const handleSubmit = async () => {
    if (!question.trim()) return

    setLoading(true)
    setError("")
    setSql("")
    setResults([])

    try {
      const response = await fetch("http://localhost:8000/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setSql(data.sql || "No SQL returned")
        setResults(data.results || [])
      }
    } catch (err) {
      setError("Failed to connect to backend. Please check your server.")
    }

    setLoading(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit()
    }
  }

  return (
    <div className="min-h-screen w-full bg-background transition-colors relative">
      {/* Header with integrated theme toggle */}
      <div className="w-full px-6 py-6">
        <div className="flex items-center justify-between mb-8">
          {/* Left side - empty for balance */}
          <div className="w-10"></div>

          {/* Center - Title */}
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Text-to-SQL Assistant</h1>
            </div>
            <p className="text-muted-foreground text-base max-w-4xl mx-auto">
              Transform natural language questions into SQL queries and explore your database with AI-powered
              assistance.
            </p>
          </div>

          {/* Right side - Theme Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="bg-card border-border hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>

        {/* Main Content - True Full Width Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[calc(100vh-300px)]">
          {/* Input Section - Takes full available width */}
          <div className="w-full">
            <Card className="shadow-sm border-border h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  <CardTitle className="text-xl">Ask Your Question</CardTitle>
                </div>
                <CardDescription>Describe what you want to know in plain English</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 h-full flex flex-col">
                <div className="space-y-2 flex-1">
                  <Textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g., Show me all users who registered last month..."
                    className="min-h-[200px] resize-none w-full"
                  />
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm text-muted-foreground">
                    <span>{question.length} characters</span>
                    <span className="hidden sm:block">Press Cmd/Ctrl + Enter to submit</span>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={loading || !question.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating SQL...
                    </>
                  ) : (
                    <>
                      <Code2 className="mr-2 h-4 w-4" />
                      Generate SQL Query
                    </>
                  )}
                </Button>

                {error && (
                  <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                    <AlertDescription className="text-red-700 dark:text-red-400 text-sm">{error}</AlertDescription>
                  </Alert>
                )}

                {sql && (
                  <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-green-800 dark:text-green-200">Generated SQL</CardTitle>
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                        >
                          Ready
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-sm bg-gray-900 dark:bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto w-full">
                        <code>{sql}</code>
                      </pre>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results Section - Takes full available width */}
          <div className="w-full">
            <Card className="shadow-sm border-border h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-emerald-500" />
                  <CardTitle className="text-xl">Query Results</CardTitle>
                </div>
                <CardDescription>
                  {results.length > 0
                    ? `Found ${results.length} result${results.length !== 1 ? "s" : ""}`
                    : "Results will appear here after running a query"}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-full">
                {results.length > 0 ? (
                  <div className="border border-border rounded-lg overflow-hidden w-full">
                    <div className="overflow-x-auto overflow-y-auto max-h-[600px] w-full">
                      <table className="w-full text-sm">
                        <thead className="bg-muted border-b border-border sticky top-0">
                          <tr>
                            {Object.keys(results[0]).map((col) => (
                              <th
                                key={col}
                                className="px-4 py-3 text-left font-medium text-foreground whitespace-nowrap"
                              >
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {results.map((row, idx) => (
                            <tr key={idx} className="hover:bg-muted/50 transition-colors">
                              {Object.values(row).map((val, i) => (
                                <td key={i} className="px-4 py-3 text-foreground whitespace-nowrap">
                                  {val !== null ? (
                                    String(val)
                                  ) : (
                                    <span className="text-muted-foreground italic">null</span>
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 h-full flex flex-col items-center justify-center">
                    <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                      <Database className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-2 text-base">No results yet</p>
                    <p className="text-sm text-muted-foreground">Ask a question to see your data here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Powered by AI • Connected to your PostgreSQL database</p>
        </div>
      </div>
    </div>
  )
}

export default App
