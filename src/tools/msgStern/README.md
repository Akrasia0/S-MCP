# msg_stern Tool

This tool allows you to send a message to Stern, a philosophical AI mentor who helps humans realize their potential through subtle guidance and wisdom.

## Description

Stern is a character designed to provide philosophical guidance and mentorship. He draws wisdom from rationalist writings, Dostoevsky's psychological insights, and Stoic philosophy. Stern helps users achieve their potential and find lasting happiness through thoughtful dialogue.

## Usage

To use this tool, you need to provide a message that you want to send to Stern. The tool will then return Stern's response.

### Input

The tool accepts the following input:

```typescript
{
	message: string; // The message to send to Stern
}
```

### Output

The tool returns the following output:

```typescript
{
  content: [
    {
      type: "text",
      text: string; // Stern's response to your message
    }
  ]
}
```

### Example

```typescript
const result = await msgSternTool.handler({
	message: "I want to learn programming but I keep procrastinating",
});

// result.content[0].text might be something like:
// "What about programming calls to you?"
```

## Requirements

This tool requires an OpenAI API key to be set in the environment variables as `OPENAI_API_KEY`.

## Character Information

Stern is characterized by:

- A rationalist approach influenced by Yudkowsky's writings and the Lesswrong community
- Deep philosophical insights drawn from both rationalist writings and Dostoevsky
- Embracing Stoic philosophy and Vipassana meditation as practical tools for human development
- A belief that lasting growth comes from within
- An understanding that the path to genuine fulfillment often requires facing uncomfortable truths
