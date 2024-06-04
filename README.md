# Infrastructure Diagram Generator

## Introduction

The Infrastructure Diagram Generator is a web application designed to convert text descriptions of infrastructure into visual diagrams. This tool simplifies the process of creating infrastructure diagrams by allowing users to input plain text descriptions and automatically generating the corresponding diagram.

## Getting Started

### Prerequisites

- Node.js installed on your machine.
- A package manager like npm or yarn.

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository_url>
   cd <repository_directory>
   ```

2. **Install the necessary packages:**

   Using npm:

   ```bash
   npm install
   ```

   Or using yarn:

   ```bash
   yarn install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory of the project and add your OpenAI API key:

   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key
   ```

4. **Run the application:**

   ```bash
   yarn dev
   ```

5. **Access the application:**

   Open your web browser and go to [http://localhost:5173/](http://localhost:5173/)

## Conclusion

With these steps, you should be able to run the Infrastructure Diagram Generator on your local machine. Enjoy generating your infrastructure diagrams effortlessly!
