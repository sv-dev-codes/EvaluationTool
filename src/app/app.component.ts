import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './services/ApiService ';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'EvaluationTool';
  question = '';
  answer = '';
  result: any = null;

  constructor(private apiService: ApiService) {}

  onButtonClick(): void {
    let obj = {
      "query": this.question,
      "answer": this.answer
    };
    this.apiService.post<any>(obj).subscribe(response => {
      console.log('API response:', response);
      this.result = response;
    });
  }
}