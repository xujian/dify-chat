import ReactMarkdown from 'react-markdown'
import 'katex/dist/katex.min.css'
import RemarkMath from 'remark-math'
import RemarkBreaks from 'remark-breaks'
import RehypeKatex from 'rehype-katex'
import RemarkGfm from 'remark-gfm'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atelierHeathLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'

export function Markdown(props: { content: string }) {
  return (
    <div className="markdown-body text-white">
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
        }}
      >
        {props.content}
      </ReactMarkdown>
    </div>
  )
}
