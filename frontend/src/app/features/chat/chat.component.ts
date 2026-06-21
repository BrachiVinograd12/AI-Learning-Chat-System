import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  message = '';
  messages: { role: 'user' | 'assistant'; content: string }[] = [
    {
      role: 'assistant',
      content: 'Hello! I am your AI learning assistant. Ask me anything about your courses.',
    },
  ];

  sendMessage(): void {
    const trimmed = this.message.trim();
    if (!trimmed) return;

    this.messages.push({ role: 'user', content: trimmed });
    this.message = '';

    // Placeholder response until AI integration is added
    this.messages.push({
      role: 'assistant',
      content: 'Thanks for your message! AI chat integration will be connected here.',
    });
  }
}
