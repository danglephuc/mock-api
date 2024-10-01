const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const jsonfile = require('jsonfile');
const path = require('path');
const fs = require('fs');
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET || 'secret';
const DB_FILE_PATH = path.join(__dirname, 'db.json');

// Mock user data
const users = [
    { id: 1, username: 'admin', password: 'admin@123', first_name: 'John', last_name: 'Doe', avatar: 'https://fastly.picsum.photos/id/421/200/200.jpg?hmac=Kix073-H73pkRedH4XJ8fenHLI9Sd9akWlOFjKog0EA'},
    { id: 2, username: 'user', password: 'user@123', first_name: 'Jane', last_name: 'Doe', avatar: 'https://fastly.picsum.photos/id/953/200/200.jpg?hmac=S5zbAl9YqUc02Oezl6cR8gcLfF3pwkQ5_AcG8JXjeC0'}
];

// Mock posts data
const posts = [
    {
        "id": 1,
        "title": "Getting Started with Node.js",
        "body": "<h1>Introduction to Node.js</h1><p>Node.js is a JavaScript runtime built on Chrome's V8 engine. It allows you to build scalable network applications.</p><ul><li><strong>Event-Driven:</strong> Handles multiple connections concurrently.</li><li><strong>Non-Blocking I/O:</strong> Improves performance by not waiting for I/O operations to complete.</li></ul><p>Node.js is popular for building server-side applications and APIs.</p>",
        "created_at": "2024-08-01T10:00:00Z",
        "created_by": 1
    },
    {
        "id": 2,
        "title": "Introduction to Vue.js",
        "body": "<h1>Vue.js Framework</h1><p>Vue.js is a progressive JavaScript framework for building user interfaces. It’s known for its simplicity and flexibility.</p><ul><li><strong>Reactive Data Binding:</strong> Automatically updates the view when the data changes.</li><li><strong>Component-Based:</strong> Encourages reusable components to build complex UIs.</li></ul><p>Vue.js is ideal for both single-page applications and complex web interfaces.</p>",
        "created_at": "2024-08-02T11:15:00Z",
        "created_by": 1
    },
    {
        "id": 3,
        "title": "A Guide to CSS Flexbox",
        "body": "<h1>Understanding Flexbox</h1><p>Flexbox is a layout module that makes it easier to design flexible and responsive layout structures.</p><h2>Key Concepts:</h2><ul><li><strong>Flex Container:</strong> The parent element that holds flex items.</li><li><strong>Flex Items:</strong> The children of the flex container.</li></ul><p>Flexbox simplifies complex layouts and helps create responsive designs.</p>",
        "created_at": "2024-08-03T12:30:00Z",
        "created_by": 1
    },
    {
        "id": 4,
        "title": "Exploring MongoDB Atlas",
        "body": "<h1>What is MongoDB Atlas?</h1><p>MongoDB Atlas is a fully-managed cloud database service that provides automated backups, scaling, and high availability.</p><ul><li><strong>Fully Managed:</strong> MongoDB handles maintenance and operations.</li><li><strong>Global Distribution:</strong> Deploy databases across multiple regions.</li></ul><p>Atlas is ideal for modern applications requiring scalability and high availability.</p>",
        "created_at": "2024-08-04T13:45:00Z",
        "created_by": 1
    },
    {
        "id": 5,
        "title": "The Benefits of RESTful APIs",
        "body": "<h1>RESTful API Basics</h1><p>RESTful APIs are architectural styles for designing networked applications. They use HTTP requests to manage data.</p><ul><li><strong>Stateless:</strong> Each request from a client contains all the information needed to process it.</li><li><strong>Scalable:</strong> Can handle a large number of requests.</li></ul><p>RESTful APIs are widely used due to their simplicity and scalability.</p>",
        "created_at": "2024-08-05T14:00:00Z",
        "created_by": 1
    },
    {
        "id": 6,
        "title": "Advanced SQL Techniques",
        "body": "<h1>Enhancing Your SQL Skills</h1><p>SQL is a powerful language for managing relational databases. Advanced techniques can improve query performance and data management.</p><h2>Techniques:</h2><ul><li><strong>Joins:</strong> Combine rows from two or more tables based on a related column.</li><li><strong>Indexes:</strong> Improve the speed of data retrieval operations.</li></ul><p>Mastering advanced SQL techniques can lead to more efficient and optimized database operations.</p>",
        "created_at": "2024-08-06T15:15:00Z",
        "created_by": 1
    },
    {
        "id": 7,
        "title": "The Evolution of JavaScript",
        "body": "<h1>JavaScript Through the Years</h1><p>JavaScript has evolved significantly since its inception, adding new features and improving performance.</p><h2>Key Milestones:</h2><ul><li><strong>ES5:</strong> Introduced features like strict mode and JSON support.</li><li><strong>ES6:</strong> Added new syntax such as arrow functions and classes.</li></ul><p>Keeping up with JavaScript updates ensures you use the latest features and best practices.</p>",
        "created_at": "2024-08-07T16:30:00Z",
        "created_by": 1
    },
    {
        "id": 8,
        "title": "Building Progressive Web Apps",
        "body": "<h1>Progressive Web Apps (PWAs)</h1><p>PWAs are web applications that offer a native app-like experience. They work offline and provide improved performance.</p><h2>Features:</h2><ul><li><strong>Offline Support:</strong> Service workers enable offline functionality.</li><li><strong>Push Notifications:</strong> Engage users with real-time updates.</li></ul><p>PWAs enhance user experience by combining the best of web and mobile apps.</p>",
        "created_at": "2024-08-08T17:45:00Z",
        "created_by": 1
    },
    {
        "id": 9,
        "title": "Understanding Docker Containers",
        "body": "<h1>Introduction to Docker</h1><p>Docker containers allow you to package applications and their dependencies into a single, portable unit.</p><ul><li><strong>Isolation:</strong> Containers run in isolated environments, ensuring consistency.</li><li><strong>Portability:</strong> Containers can run on any system with Docker installed.</li></ul><p>Docker simplifies application deployment and scaling by providing a consistent environment across different systems.</p>",
        "created_at": "2024-08-09T18:00:00Z",
        "created_by": 1
    },
    {
        "id": 10,
        "title": "The Role of Cloud Computing",
        "body": "<h1>Cloud Computing Explained</h1><p>Cloud computing provides on-demand delivery of computing services over the internet, including storage, processing, and networking.</p><h2>Benefits:</h2><ul><li><strong>Scalability:</strong> Easily scale resources up or down as needed.</li><li><strong>Cost-Efficiency:</strong> Pay only for the resources you use.</li></ul><p>Cloud computing helps businesses reduce costs and increase flexibility.</p>",
        "created_at": "2024-08-10T19:15:00Z",
        "created_by": 1
    },
    {
        "id": 11,
        "title": "Introduction to API Security",
        "body": "<h1>Securing Your APIs</h1><p>API security is crucial for protecting data and preventing unauthorized access. Implementing security measures helps ensure the integrity and confidentiality of your API.</p><h2>Best Practices:</h2><ul><li><strong>Authentication:</strong> Verify the identity of users accessing the API.</li><li><strong>Authorization:</strong> Ensure users have permission to access specific resources.</li></ul><p>Following these practices helps safeguard your APIs from potential threats.</p>",
        "created_at": "2024-08-11T20:30:00Z",
        "created_by": 1
    },
    {
        "id": 12,
        "title": "Building Scalable Applications",
        "body": "<h1>Scalability in Software Design</h1><p>Scalable applications can handle increased load by adding resources or optimizing performance without significant changes.</p><h2>Strategies:</h2><ul><li><strong>Horizontal Scaling:</strong> Add more instances to distribute the load.</li><li><strong>Load Balancing:</strong> Distribute traffic across multiple servers.</li></ul><p>Implementing scalability strategies ensures your application can grow with user demand.</p>",
        "created_at": "2024-08-12T21:45:00Z",
        "created_by": 1
    },
    {
        "id": 13,
        "title": "Introduction to GraphQL",
        "body": "<h1>What is GraphQL?</h1><p>GraphQL is a query language for APIs that allows clients to request exactly the data they need. It provides a more efficient and flexible alternative to REST.</p><h2>Features:</h2><ul><li><strong>Flexible Queries:</strong> Clients specify the structure of the response.</li><li><strong>Strong Typing:</strong> Defines a schema to validate queries.</li></ul><p>GraphQL improves the efficiency of data fetching and enhances developer experience.</p>",
        "created_at": "2024-08-13T22:00:00Z",
        "created_by": 1
    },
    {
        "id": 14,
        "title": "The Importance of Unit Testing",
        "body": "<h1>Why Unit Testing Matters</h1><p>Unit testing involves testing individual components or functions of a software application to ensure they work as expected.</p><h2>Benefits:</h2><ul><li><strong>Early Detection:</strong> Identify and fix bugs early in the development process.</li><li><strong>Improved Code Quality:</strong> Ensures code changes don’t break existing functionality.</li></ul><p>Unit testing helps maintain code reliability and robustness.</p>",
        "created_at": "2024-08-14T23:15:00Z",
        "created_by": 1
    },
    {
        "id": 15,
        "title": "Exploring TypeScript",
        "body": "<h1>What is TypeScript?</h1><p>TypeScript is a statically typed superset of JavaScript that compiles to plain JavaScript. It adds optional static typing and other features to JavaScript.</p><h2>Advantages:</h2><ul><li><strong>Static Typing:</strong> Helps catch errors at compile time.</li><li><strong>Enhanced IDE Support:</strong> Provides better autocompletion and refactoring tools.</li></ul><p>TypeScript improves code quality and development experience.</p>",
        "created_at": "2024-08-15T00:30:00Z",
        "created_by": 1
    },
    {
        "id": 16,
        "title": "Design Patterns in Software Engineering",
        "body": "<h1>Introduction to Design Patterns</h1><p>Design patterns are reusable solutions to common software design problems. They provide best practices for creating flexible and maintainable code.</p><h2>Common Patterns:</h2><ul><li><strong>Singleton:</strong> Ensures a class has only one instance.</li><li><strong>Observer:</strong> Allows objects to be notified of changes in another object.</li></ul><p>Understanding design patterns helps create more robust and scalable software.</p>",
        "created_at": "2024-08-16T01:45:00Z",
        "created_by": 1
    },
    {
        "id": 17,
        "title": "Getting Started with React",
        "body": "<h1>Introduction to React</h1><p>React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and manage application state efficiently.</p><h2>Key Features:</h2><ul><li><strong>Component-Based:</strong> Build encapsulated components that manage their own state.</li><li><strong>Virtual DOM:</strong> Enhances performance by minimizing direct manipulation of the DOM.</li></ul><p>React is popular for building dynamic and interactive web applications.</p>",
        "created_at": "2024-08-17T02:00:00Z",
        "created_by": 1
    },
    {
        "id": 18,
        "title": "The Power of WebAssembly",
        "body": "<h1>What is WebAssembly?</h1><p>WebAssembly (Wasm) is a binary instruction format designed for efficient execution on web browsers. It allows code written in languages other than JavaScript to run in the browser.</p><h2>Benefits:</h2><ul><li><strong>Performance:</strong> Executes code at near-native speed.</li><li><strong>Language Support:</strong> Enables applications written in languages like C++ and Rust to run on the web.</li></ul><p>WebAssembly expands the capabilities of web applications and enhances performance.</p>",
        "created_at": "2024-08-18T03:15:00Z",
        "created_by": 1
    },
    {
        "id": 19,
        "title": "Mastering Asynchronous JavaScript",
        "body": "<h1>Understanding Asynchronous JavaScript</h1><p>Asynchronous JavaScript allows you to perform non-blocking operations, such as handling network requests and timers.</p><h2>Key Concepts:</h2><ul><li><strong>Callbacks:</strong> Functions passed as arguments to be executed later.</li><li><strong>Promises:</strong> Represent the eventual completion of an asynchronous operation.</li><li><strong>Async/Await:</strong> Syntactic sugar for working with promises, making asynchronous code easier to read.</li></ul><p>Mastering asynchronous JavaScript is essential for building responsive web applications.</p>",
        "created_at": "2024-08-19T04:30:00Z",
        "created_by": 1
    },
    {
        "id": 20,
        "title": "Optimizing Front-End Performance",
        "body": "<h1>Improving Front-End Performance</h1><p>Front-end performance impacts user experience and engagement. Optimizing performance ensures your website loads quickly and efficiently.</p><h2>Techniques:</h2><ul><li><strong>Minification:</strong> Reduce file size by removing unnecessary characters.</li><li><strong>Lazy Loading:</strong> Load resources only when needed.</li><li><strong>Code Splitting:</strong> Break up code into smaller bundles to improve loading times.</li></ul><p>Applying these techniques can significantly enhance front-end performance.</p>",
        "created_at": "2024-08-20T05:45:00Z",
        "created_by": 1
    },
    {
        "id": 21,
        "title": "Exploring Machine Learning Basics",
        "body": "<h1>Introduction to Machine Learning</h1><p>Machine Learning (ML) involves training algorithms to learn from data and make predictions or decisions.</p><h2>Types of ML:</h2><ul><li><strong>Supervised Learning:</strong> Uses labeled data to train models.</li><li><strong>Unsupervised Learning:</strong> Identifies patterns in unlabeled data.</li><li><strong>Reinforcement Learning:</strong> Trains models through trial and error.</li></ul><p>Machine Learning is a key component of modern AI applications.</p>",
        "created_at": "2024-08-21T07:00:00Z",
        "created_by": 1
    },
    {
        "id": 22,
        "title": "The Basics of Docker Compose",
        "body": "<h1>Introduction to Docker Compose</h1><p>Docker Compose is a tool for defining and running multi-container Docker applications. It uses YAML files to configure services, networks, and volumes.</p><h2>Features:</h2><ul><li><strong>Configuration:</strong> Define the entire application stack in a single file.</li><li><strong>Automation:</strong> Start, stop, and manage containers with simple commands.</li></ul><p>Docker Compose simplifies the management of complex applications.</p>",
        "created_at": "2024-08-22T08:15:00Z",
        "created_by": 1
    },
    {
        "id": 23,
        "title": "Creating Responsive Web Designs",
        "body": "<h1>Responsive Web Design Principles</h1><p>Responsive web design ensures that web applications look and work well on various devices and screen sizes.</p><h2>Techniques:</h2><ul><li><strong>Media Queries:</strong> Apply different styles based on screen size and resolution.</li><li><strong>Fluid Grids:</strong> Use percentage-based widths for flexible layouts.</li><li><strong>Flexible Images:</strong> Ensure images scale properly within their containers.</li></ul><p>Responsive design improves usability and accessibility across devices.</p>",
        "created_at": "2024-08-23T09:30:00Z",
        "created_by": 1
    },
    {
        "id": 24,
        "title": "Introduction to RESTful Services",
        "body": "<h1>Understanding RESTful Services</h1><p>RESTful services use HTTP methods to create, read, update, and delete resources. They are designed to be stateless and scalable.</p><h2>Principles:</h2><ul><li><strong>Uniform Interface:</strong> Consistent and predictable API endpoints.</li><li><strong>Stateless:</strong> Each request from a client must contain all the information needed to process it.</li></ul><p>RESTful services are widely used for building web APIs and services.</p>",
        "created_at": "2024-08-24T10:45:00Z",
        "created_by": 1
    },
    {
        "id": 25,
        "title": "Introduction to NoSQL Databases",
        "body": "<h1>NoSQL Database Overview</h1><p>NoSQL databases are designed to handle a wide variety of data models and offer flexibility and scalability.</p><h2>Types:</h2><ul><li><strong>Document Stores:</strong> Store data in JSON-like documents (e.g., MongoDB).</li><li><strong>Key-Value Stores:</strong> Store data as key-value pairs (e.g., Redis).</li><li><strong>Column-Family Stores:</strong> Store data in columns rather than rows (e.g., Cassandra).</li></ul><p>NoSQL databases are suitable for applications with large-scale and diverse data needs.</p>",
        "created_at": "2024-08-25T12:00:00Z",
        "created_by": 1
    },
    {
        "id": 26,
        "title": "Understanding Authentication Mechanisms",
        "body": "<h1>Authentication Methods</h1><p>Authentication mechanisms verify the identity of users and ensure secure access to systems.</p><h2>Common Methods:</h2><ul><li><strong>Username/Password:</strong> Traditional method requiring users to provide credentials.</li><li><strong>OAuth:</strong> Allows users to grant third-party applications limited access.</li><li><strong>JWT:</strong> JSON Web Tokens provide a compact and self-contained way to represent claims between parties.</li></ul><p>Choosing the right authentication method is crucial for securing applications.</p>",
        "created_at": "2024-08-26T13:15:00Z",
        "created_by": 1
    },
    {
        "id": 27,
        "title": "Best Practices for API Documentation",
        "body": "<h1>Effective API Documentation</h1><p>API documentation provides essential information about how to use and integrate with an API.</p><h2>Best Practices:</h2><ul><li><strong>Clarity:</strong> Ensure documentation is clear and easy to understand.</li><li><strong>Examples:</strong> Provide practical examples of API usage.</li><li><strong>Updates:</strong> Keep documentation up-to-date with API changes.</li></ul><p>Good documentation helps developers understand and use your API effectively.</p>",
        "created_at": "2024-08-27T14:30:00Z",
        "created_by": 1
    },
    {
        "id": 28,
        "title": "Building Microservices Architectures",
        "body": "<h1>Microservices Overview</h1><p>Microservices architecture involves breaking down applications into small, independent services that communicate over network protocols.</p><h2>Advantages:</h2><ul><li><strong>Scalability:</strong> Scale individual services independently.</li><li><strong>Flexibility:</strong> Use different technologies and databases for different services.</li></ul><p>Microservices enable more flexible and scalable application development.</p>",
        "created_at": "2024-08-28T15:45:00Z",
        "created_by": 1
    },
    {
        "id": 29,
        "title": "Understanding REST API Rate Limiting",
        "body": "<h1>Rate Limiting in APIs</h1><p>Rate limiting controls the number of requests a client can make to an API within a specific time frame. It helps prevent abuse and ensures fair use.</p><h2>Techniques:</h2><ul><li><strong>Token Bucket:</strong> Allows a certain number of requests per time period.</li><li><strong>Leaky Bucket:</strong> Requests are processed at a constant rate, smoothing out bursts.</li></ul><p>Implementing rate limiting helps manage API traffic and maintain performance.</p>",
        "created_at": "2024-08-29T17:00:00Z",
        "created_by": 1
    },
    {
        "id": 30,
        "title": "Introduction to Cloud-Native Development",
        "body": "<h1>What is Cloud-Native Development?</h1><p>Cloud-native development involves designing and building applications specifically for cloud environments, leveraging cloud capabilities for scalability and resilience.</p><h2>Principles:</h2><ul><li><strong>Microservices:</strong> Decompose applications into small, loosely-coupled services.</li><li><strong>Containers:</strong> Package applications and dependencies into containers for consistency across environments.</li><li><strong>Continuous Delivery:</strong> Automate the deployment process to enable frequent and reliable releases.</li></ul><p>Cloud-native development practices improve the scalability and maintainability of applications.</p>",
        "created_at": "2024-08-30T18:15:00Z",
        "created_by": 1
    }
];

function initializeDatabase() {
    const initialData = {
        posts: posts
    };
    jsonfile.writeFileSync(DB_FILE_PATH, initialData, { spaces: 2 });
}

if (!fs.existsSync(DB_FILE_PATH)) {
    initializeDatabase();
}

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '7d' });

        return res.json({
            access_token: token,
            token_type: 'Bearer',
            expires_in: 3600,
            refresh_token: refreshToken
        });
    } else {
        return res.status(401).json({ error: 'Invalid username or password' });
    }
});

// Logout endpoint
app.post('/logout', (req, res) => {
    return res.json({ message: 'Logged out successfully' });
});

// Refresh token endpoint
app.post('/refresh-token', (req, res) => {
    const refreshToken = req.body.refresh_token;

    if (refreshToken == null) return res.sendStatus(401);

    jwt.verify(refreshToken, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);

        const token = jwt.sign({ userId: user.userId }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({
            access_token: token,
            token_type: 'Bearer',
            expires_in: 3600
        });
    });
});

// Get profile endpoint
app.get('/profile', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.userId);
    res.json({
        id: user.id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        avatar: user.avatar
    });
});

// Middleware to authenticate requests
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Protected route to get posts
app.get('/posts', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const data = jsonfile.readFileSync(DB_FILE_PATH);
    // Order posts by created_at in descending order
    const orderedPosts = data.posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const paginatedPosts = orderedPosts.slice(startIndex, startIndex + limit);
    // Update created_by field with user details
    paginatedPosts.forEach(post => {
        const user = users.find(u => u.id === post.created_by);
        post.created_by = {
            id: user.id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            avatar: user.avatar
        };
    });

    // Set pagination headers
    res.setHeader('X-Total-Count', posts.length);
    res.setHeader('X-Total-Pages', Math.ceil(posts.length / limit));
    res.setHeader('X-Current-Page', page);
    res.setHeader('X-Per-Page', limit);

    // return json with pagination headers
    return res.json(paginatedPosts);
});

// Get a single post by ID
app.get('/posts/:id', (req, res) => {
    const data = jsonfile.readFileSync(DB_FILE_PATH);
    const postId = parseInt(req.params.id);
    const post = data.posts.find(post => post.id === postId);

    if (post) {
        const user = users.find(u => u.id === post.created_by);
        post.created_by = {
            id: user.id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            avatar: user.avatar
        };
        return res.json(post);
    } else {
        return res.status(404).json({ error: 'Post not found' });
    }
});

// Create a new post
app.post('/posts', authenticateToken, (req, res) => {
    const data = jsonfile.readFileSync(DB_FILE_PATH);
    const { title, body } = req.body;
    // Validate input
    const errors = {};
    if (!title) {
        errors['title'] = 'Title is required';
    }
    if (!body) {
        errors['body'] = 'Body is required';
    }
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
    }

    const newPost = {
        id: data.posts[data.posts.length - 1].id + 1,
        title,
        body,
        created_at: new Date().toISOString(),
        created_by: req.user.userId
    };
    data.posts.push(newPost);
    jsonfile.writeFileSync(DB_FILE_PATH, data, { spaces: 2 });
    res.status(201).json(newPost);
});

// Update an existing post
app.patch('/posts/:id', authenticateToken, (req, res) => {
    const data = jsonfile.readFileSync(DB_FILE_PATH);
    const postId = parseInt(req.params.id);
    const { title, body } = req.body;

    const postIndex = data.posts.findIndex(post => post.id === postId);
    if (postIndex === -1) {
        return res.status(404).json({ error: 'Post not found' });
    }

    data.posts[postIndex] = {
        ...data.posts[postIndex],
        ...(title && { title }),
        ...(body && { body })
    };
    jsonfile.writeFileSync(DB_FILE_PATH, data, { spaces: 2 });
    res.json(data.posts[postIndex]);
});

app.delete('/posts/:id', authenticateToken, (req, res) => {
    const data = jsonfile.readFileSync(DB_FILE_PATH);
    const postId = parseInt(req.params.id);
    const postIndex = data.posts.findIndex(post => post.id === postId);
    if (postIndex === -1) {
        return res.status(404).json({ error: 'Post not found' });
    }

    data.posts = data.posts.filter(post => post.id !== postId);
    jsonfile.writeFileSync(DB_FILE_PATH, data, { spaces: 2 });
    res.status(204).send();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
