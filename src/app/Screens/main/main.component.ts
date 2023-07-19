import { Component } from '@angular/core';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {

  pdfSrc: string = '../../../assets/pdf/info.pdf'

  zoom = 1.0;
  
  zoomIn(): void {
    this.zoom += 0.1;
  }

  zoomOut(): void {
    if (this.zoom > 0.5) {
      this.zoom -= 0.1;
    }
  }

  zoomReset(): void {
    this.zoom = 1.0;
  }

  uploadFile()
  {
    console.log('Se esta cargando')
  }

  onUpload(event: any): void {
    console.log('Jelou')
  }

}
