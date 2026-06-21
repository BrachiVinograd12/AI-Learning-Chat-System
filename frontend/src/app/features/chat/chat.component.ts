import { Component, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  Conversation,
  LearningMode,
  MessageRole,
} from '@ai-learning/shared';
import { AuthService } from '../../core/services/auth.service';
import { ChatService, StoredConversation } from '../../core/services/chat.service';
import { getModeUiConfig, LEARNING_MODE_UI, ModeUiConfig } from './learning-mode.config';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesEnd') messagesEnd!: ElementRef;

  conversation: Conversation | null = null;
  storedConversations: StoredConversation[] = [];
  messageInput = '';
  subjectInput = '';
  selectedMode = LearningMode.Explanation;
  showNewChatModal = false;
  loading = false;
  sending = false;
  error: string | null = null;
  sidebarOpen = true;
  private shouldScroll = false;

  readonly modes = LEARNING_MODE_UI;
  readonly MessageRole = MessageRole;

  get activeMode(): ModeUiConfig {
    return getModeUiConfig(this.selectedMode);
  }

  constructor(
    private readonly auth: AuthService,
    private readonly chatService: ChatService,
  ) {}

  ngOnInit(): void {
    this.storedConversations = this.chatService.getStoredConversations();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  openNewChat(): void {
    this.subjectInput = '';
    this.showNewChatModal = true;
  }

  createConversation(): void {
    if (!this.subjectInput.trim()) return;

    this.loading = true;
    this.error = null;

    this.chatService.createConversation({ subject: this.subjectInput.trim() }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.conversation = res.data;
          this.chatService.saveConversation(res.data);
          this.storedConversations = this.chatService.getStoredConversations();
          this.showNewChatModal = false;
        } else {
          this.error = res.error?.message ?? 'Failed to create conversation';
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Could not connect to the server';
      },
    });
  }

  loadConversation(id: string): void {
    this.loading = true;
    this.error = null;

    this.chatService.getConversation(id).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.conversation = res.data;
          this.shouldScroll = true;
        } else {
          this.error = res.error?.message ?? 'Conversation not found';
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Could not load conversation';
      },
    });
  }

  sendMessage(): void {
    const content = this.messageInput.trim();
    if (!content || !this.conversation || this.sending) return;

    this.sending = true;
    this.error = null;
    const mode = this.selectedMode;

    this.chatService
      .sendMessage(this.conversation.id, { content, mode })
      .subscribe({
        next: (res) => {
          this.sending = false;
          if (res.success && res.data) {
            this.conversation = res.data;
            this.chatService.saveConversation(res.data);
            this.storedConversations = this.chatService.getStoredConversations();
            this.messageInput = '';
            this.shouldScroll = true;
          } else {
            this.error = res.error?.message ?? 'Failed to send message';
          }
        },
        error: () => {
          this.sending = false;
          this.error = 'Could not send message';
        },
      });
  }

  deleteConversation(id: string, event: Event): void {
    event.stopPropagation();
    this.chatService.removeConversation(id);
    this.storedConversations = this.chatService.getStoredConversations();
    if (this.conversation?.id === id) {
      this.conversation = null;
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout(): void {
    this.auth.logout();
  }

  getModeLabel(mode: LearningMode): string {
    return getModeUiConfig(mode).label;
  }

  onModeChange(mode: string): void {
    this.selectedMode = mode as LearningMode;
  }

  getModeBadgeClass(mode: LearningMode): string {
    return getModeUiConfig(mode).badgeClass;
  }

  private scrollToBottom(): void {
    this.messagesEnd?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
  }
}
