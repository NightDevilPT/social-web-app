<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Social Media Assignment - README</title>
</head>
<body>
  <h1>Social Media Assignment</h1>
  <p>
    This is a social media application built using Next.js, React, Prisma, and other modern web development technologies.
  </p>

  <h2>Features</h2>
  <ul>
    <li>Data handling with Prisma and TanStack Query</li>
    <li>UI components built using ShadCN and TailwindCSS</li>
    <li>Client-side form validation with React Hook Form</li>
    <li>JWT for secure token handling</li>
  </ul>

  <h2>Prerequisites</h2>
  <p>
    Before you can run this project locally, ensure you have the following installed on your system:
  </p>
  <ul>
    <li><strong>Node.js</strong> (v18 or later recommended)</li>
    <li><strong>npm</strong> or <strong>yarn</strong></li>
    <li><strong>MongoDB</strong> or any other database compatible with Prisma (ensure it’s running and accessible)</li>
  </ul>

  <h2>Installation</h2>
  <ol>
    <li>
      Clone the repository:
      <pre><code>git clone https://github.com/your-username/social-media-assignment.git</code></pre>
    </li>
    <li>
      Navigate to the project directory:
      <pre><code>cd social-media-assignment</code></pre>
    </li>
    <li>
      Install dependencies:
      <pre><code>npm install
# or
yarn install</code></pre>
    </li>
  </ol>

  <h2>Setup</h2>
  <h3>Environment Variables</h3>
  <p>
    Create a <code>.env</code> file in the root of your project and add the following variables:
  </p>
  <pre><code>
DATABASE_URL=your_database_url_here
NEXT_JWT_SECRET=your_nextauth_secret
  </code></pre>
  <p>
    Replace <code>your_database_url_here</code> with your database connection string and 
    <code>your_nextauth_secret</code> with a secure secret.
  </p>

  <h3>Prisma Setup</h3>
  <p>Generate Prisma client and migrate your database schema:</p>
  <pre><code>npx prisma generate
npx prisma migrate dev --name init</code></pre>

  <h2>Running the Application Locally</h2>
  <ol>
    <li>
      Start the development server:
      <pre><code>npm run dev
# or
yarn dev</code></pre>
      <p>The application will be available at <a href="http://localhost:3000" target="_blank">http://localhost:3000</a>.</p>
    </li>
  </ol>

  <h2>Build and Start for Production</h2>
  <ol>
    <li>
      Build the application:
      <pre><code>npm run build
# or
yarn build</code></pre>
    </li>
    <li>
      Start the production server:
      <pre><code>npm run start
# or
yarn start</code></pre>
      <p>The application will now be running in production mode.</p>
    </li>
  </ol>

  <h2>Linting</h2>
  <p>To lint your code, run:</p>
  <pre><code>npm run lint
# or
yarn lint</code></pre>

  <h2>Tech Stack</h2>
  <ul>
    <li><strong>Frontend:</strong> React, Next.js, TailwindCSS</li>
    <li><strong>Backend:</strong> Prisma, Next.js</li>
    <li><strong>Database:</strong> MongoDB (or any other Prisma-supported database)</li>
    <li><strong>Utilities:</strong> Axios, TanStack Query, Zod for schema validation</li>
  </ul>

  <hr>
  
  <p>Feel free to reach out for any issues or contributions!</p>
</body>
</html>
