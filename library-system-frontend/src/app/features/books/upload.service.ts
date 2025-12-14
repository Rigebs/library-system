import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface UploadResponse {
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private http = inject(HttpClient);
  private readonly UPLOAD_API_URL = 'http://localhost:8080/api/files/upload';

  uploadFile(file: File, folder: string): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('folder', folder);

    return this.http.post<UploadResponse>(this.UPLOAD_API_URL, formData);
  }
}
