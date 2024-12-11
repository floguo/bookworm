import React, { ChangeEvent, useState } from 'react';

interface KeyPoint {
  title: string;
  content: string;
}

interface PDFUploaderProps {
  onExtract: (keyPoints: KeyPoint[]) => void;
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ onExtract }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<string>('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleExtract = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setProgress('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/extract-key-points', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to extract key points');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedData = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          accumulatedData += chunk;
          setProgress(accumulatedData);
        }
      }

      try {
        const keyPoints = JSON.parse(accumulatedData).keyPoints;
        onExtract(keyPoints);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        setError('Failed to parse the extracted key points.');
      }
    } catch (err) {
      console.error('Error processing PDF:', err);
      setError('Failed to process the PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="pdf-upload" className="text-sm font-medium text-gray-700">
          Upload Book (PDF)
        </label>
        <input
          type="file"
          id="pdf-upload"
          accept="application/pdf"
          onChange={handleFileChange}
          disabled={isLoading}
          className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      
      <button
        onClick={handleExtract}
        disabled={!file || isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {isLoading ? 'Extracting...' : 'Extract Key Points'}
      </button>
      
      {isLoading && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
            <div className="text-sm text-gray-600">Extracting key points, please wait...</div>
          </div>
          <div className="text-sm text-gray-600 whitespace-pre-wrap">{progress}</div>
        </div>
      )}
      
      {error && (
        <div className="text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default PDFUploader;

