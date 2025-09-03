
'use client';

import { useState, useEffect, useRef, useActionState, type FormEvent } from 'react';
import { Bot, User, Send, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAIPrediction, FormState } from '@/lib/actions';
import type { PredictBusEtaOutput } from '@/ai/flows/ai-powered-eta';

// --- SUB-COMPONENTS ---

interface Message {
  role: 'user' | 'assistant' | 'status';
  content: React.ReactNode;
}

const MessageBubble = ({ message }: { message: Message }) => {
  const isUser = message.role === 'user';
  const Icon = isUser ? User : Bot;
  const bubbleClasses = isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary';
  const justifyContent = isUser ? 'justify-end' : 'justify-start';

  return (
    <div className={`flex items-start gap-3 ${justifyContent}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
          <Icon size={20} />
        </div>
      )}
      <div className={`p-3 rounded-lg max-w-sm ${bubbleClasses}`}>
        {message.content}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
          <Icon size={20} />
        </div>
      )}
    </div>
  );
};

const AIPrediction = ({ data }: { data: PredictBusEtaOutput }) => (
  <Card className="border-primary/50">
    <CardContent className="p-3">
        <p className='font-semibold mb-2'>ETA Prediction:</p>
        <p>The bus is predicted to arrive in <span className='font-bold text-primary'>{data.predictedEta} minutes</span>.</p>
        <p className='text-sm text-muted-foreground mt-2'>{data.explanation}</p>
        <p className='text-xs text-muted-foreground mt-2'>Confidence: {Math.round(data.confidence * 100)}%</p>
    </CardContent>
  </Card>
);

const examplePrompts = [
    "What's the ETA for bus B-505 at Akota?",
    "How long until bus B-218 reaches Gotri?",
    "When will bus B-731 get to Manjalpur?",
];

const ExamplePrompts = ({ onExampleClick }: { onExampleClick: (prompt: string) => void }) => (
  <Card className="bg-secondary/50">
    <CardContent className="p-4 space-y-2">
      <p className="text-sm font-medium">Try asking:</p>
      {examplePrompts.map(prompt => (
        <Button key={prompt} variant="outline" size="sm" className="w-full justify-start text-left h-auto" onClick={() => onExampleClick(prompt)}>
          "{prompt}"
        </Button>
      ))}
    </CardContent>
  </Card>
);

const ChatInput = ({ onSubmit, inputValue, onInputChange, isPending }: { 
    onSubmit: (e: FormEvent<HTMLFormElement>) => void,
    inputValue: string,
    onInputChange: (value: string) => void,
    isPending: boolean 
}) => (
    <form onSubmit={onSubmit} className="flex gap-2 p-2 rounded-lg shadow-sm bg-background border">
        <Input
          name="prompt"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="e.g., When will bus B-505 arrive at Akota?"
          disabled={isPending}
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button type="submit" disabled={isPending || !inputValue} size="icon">
          <Send className="w-4 h-4" />
        </Button>
    </form>
);


// --- MAIN COMPONENT ---

export default function AiAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const initialState: FormState = { message: '' };
  const [state, formAction, isPending] = useActionState(getAIPrediction, initialState);
  
  const handleFormSubmit = (formData: FormData) => {
    const prompt = formData.get('prompt') as string;
    if (!prompt) return;

    setMessages(prev => [...prev, { role: 'user', content: prompt }]);
    setInputValue('');
    formAction(formData);
  };
  
  useEffect(() => {
    if (state?.message) {
      const role = 'assistant' as const;
      let content: React.ReactNode;

      if (state.data) {
        content = <AIPrediction data={state.data} />;
      } else if (state.issues) {
        content = `I couldn't process that. ${state.issues.join(' ')}`;
      } else {
        content = state.message;
      }
      setMessages(prev => [...prev, { role, content }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    if (scrollContainerRef.current) {
        const { scrollHeight, clientHeight } = scrollContainerRef.current;
        scrollContainerRef.current.scrollTo({ top: scrollHeight - clientHeight, behavior: 'smooth' });
    }
  }, [messages, isPending]);
  
  const handleExampleClick = (prompt: string) => {
    const formData = new FormData();
    formData.append('prompt', prompt);
    handleFormSubmit(formData);
  };

  return (
    <div className="flex flex-col h-[60vh]">
      <div className="flex items-center gap-3 mb-4">
        <Bot className="w-8 h-8 text-primary" />
        <div>
          <h3 className="text-lg font-semibold">AI Assistant</h3>
          <p className="text-sm text-muted-foreground">Ask me about bus ETAs!</p>
        </div>
      </div>
      <ScrollArea className="flex-1 mb-4 pr-4" viewportRef={scrollContainerRef}>
        <div className="space-y-4">
          {messages.map((message, index) => <MessageBubble key={index} message={message} />)}
          
          {isPending && (
             <div className="flex items-start gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                  <Bot size={20} />
                </div>
                 <div className="p-3 rounded-lg bg-secondary">
                    <Loader className="w-5 h-5 animate-spin" />
                 </div>
             </div>
          )}

          {messages.length === 0 && !isPending && (
             <ExamplePrompts onExampleClick={handleExampleClick} />
          )}
        </div>
      </ScrollArea>
      <ChatInput 
        onSubmit={(e) => { e.preventDefault(); handleFormSubmit(new FormData(e.currentTarget)); }}
        inputValue={inputValue}
        onInputChange={setInputValue}
        isPending={isPending}
      />
    </div>
  );
}
