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
  loading = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  onButtonClick(): void {
    this.loading = true;
    this.result = null;
    this.error = null;
    let obj = {
      "query": this.question,
      "answer": this.answer
    };
    this.apiService.post<any>(obj).subscribe({
      next: (response) => {
        console.log('API response:', response);
        this.result = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('API error:', error);
        this.error = error.message || 'Something went wrong. Please try again.';
        this.loading = false;
      }
    });
  }

  dismissError(): void {
    this.error = null;
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  isObject(value: any): boolean {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  getMetricKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  getMetricKeysWithoutOverall(obj: any): string[] {
    return Object.keys(obj).filter(key => key.toLowerCase() !== 'overall');
  }

  getOverallScore(): number | null {
    if (this.result?.agentFlow) {
      const scoringAgent = this.result.agentFlow.find((a: any) => a.agent === 'Scoring Agent');
      if (scoringAgent && this.isObject(scoringAgent.decision) && scoringAgent.decision.overall !== undefined) {
        return scoringAgent.decision.overall;
      }
    }
    return null;
  }

  getMetricColorClass(value: number): string {
    if (value <= 40) {
      return 'metric-poor';
    } else if (value <= 70) {
      return 'metric-average';
    } else {
      return 'metric-good';
    }
  }

  getAgentClass(agent: string): string {
    const classes: { [key: string]: string } = {
      'Coverage Agent': 'coverage-agent',
      'Risk Agent': 'risk-agent',
      'Improvement Agent': 'improvement-agent',
      'Scoring Agent': 'scoring-agent'
    };
    return classes[agent] || '';
  }

  getScorePercentage(score: string): number {
    const match = score.match(/(\d+)\s*\/\s*(\d+)/);
    if (match) {
      const numerator = parseInt(match[1], 10);
      const denominator = parseInt(match[2], 10);
      return (numerator / denominator) * 100;
    }
    const numericScore = parseInt(score, 10);
    return isNaN(numericScore) ? 0 : numericScore * 10;
  }

  getScoreColorClass(score: string): string {
    const match = score.match(/(\d+)/);
    const numericScore = match ? parseInt(match[1], 10) : 0;
    
    if (numericScore <= 4) {
      return 'score-poor';
    } else if (numericScore <= 7) {
      return 'score-average';
    } else {
      return 'score-good';
    }
  }

  getCoverageBlocks(coverage: string): { filled: number[]; empty: number[] } {
    const match = coverage.match(/(\d+)/);
    const percent = match ? parseInt(match[1], 10) : 0;
    const totalBlocks = 10;
    const filledCount = Math.round(percent / 10);
    const emptyCount = totalBlocks - filledCount;
    return {
      filled: Array(filledCount).fill(0),
      empty: Array(emptyCount).fill(0)
    };
  }

  getCoverageValue(coverage: string): number {
    const match = coverage.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }
}