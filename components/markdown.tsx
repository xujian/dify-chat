import ReactMarkdown from 'react-markdown'
import 'katex/dist/katex.min.css'
import RemarkMath from 'remark-math'
import RemarkBreaks from 'remark-breaks'
import RehypeKatex from 'rehype-katex'
import RemarkGfm from 'remark-gfm'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atelierHeathLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { useEffect, useRef, useState } from 'react'

export function Markdown(props: { content: string }) {

  const [content, setContent] = useState(props.content),
    [thoughts, setThoughts] = useState<string[]>([])

  useEffect(() => {
    const c = props.content
    // process <think>
    // matches <think>....</think>/ or <think>........
    const thinkRegex = /<think>([\s\S]*?)(?:<\/think>|$)/g
    const thinkMatches = c.match(thinkRegex)
    if (thinkMatches) {
      const t: string[] = []
      thinkMatches.forEach((match) => {
        const thinkContent = match.replace(/<think>|<\/think>/g, '')
        t.push(thinkContent)
      })
      setThoughts(t)
    }
    // get the match of <think> and remains
    setContent(c.replace(thinkRegex, ''))
    console.log('thoughts0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-=', thoughts, '---;', content)
  }, [props.content])

  return (
    <div className="markdown-body">
      {thoughts.map((t, index) => (
        <div className='thought' key={index}>
          <div dangerouslySetInnerHTML={{ __html: t }} />
        </div>
      ))}
      <ReactMarkdown
        remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
        rehypePlugins={[
          RehypeKatex,
        ]}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            return match
              ? (
                <SyntaxHighlighter
                  className={className}
                  children={String(children).replace(/\n$/, '')}
                  style={atelierHeathLight}
                  language={match[1]}
                  showLineNumbers
                  PreTag="div"
                />
              )
              : (
                <code {...props} className={className}>
                  {children}
                </code>
              )
          },
        }}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
