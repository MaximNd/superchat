import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ChatResolverService } from './services/ChatService/ChatResolverService/chat-resolver.service';

const routes: Routes = [
  { path: '', component: ChatComponent, resolve: [ChatResolverService] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
