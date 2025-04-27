# Dify Chat

Base on [Dify's official chat bot client](https://github.com/langgenius/webapp-conversation)

## Enhancements
add features from the base repo
- Integrated Shadcn UI and Radix UI component libraries for improved accessibility and design consistency
- Implemented Redux Toolkit for robust state management architecture
- Completely redesigned user interface for better usability and aesthetics
- Extended functionality with custom components:
  - Card Components (both preset templates and customizable options) 卡片
  - Form Components (both preset templates and customizable options) 表单


## Config

```
Config more in `config/index.ts` file:   
```js
export const APP_INFO: AppInfo = {
  title: 'Chat APP',
  description: '',
  copyright: '',
  privacy_policy: '',
  default_language: 'zh-Hans',
  useHistory: false,
}

export const isShowPrompt = true
export const promptTemplate = ''
```

## Getting Started
First, install dependencies:
```bash
pnpm install
```

Then, run the development server:

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
