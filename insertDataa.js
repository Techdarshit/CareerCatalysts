const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = 8080;

// Models
const Assessment = require("./models/assessment");
const Roadmap = require("./models/roadmaps");
const Course = require("./models/course");

// MongoDB Connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
    });
    console.log("✅ Connected to MongoDB!");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  }
}

const assessments = [
  // Web Development
  {
    careerPath: "Web Development",
    level: "beginner",
    tests: [
      {
        testName: "HTML Basics",
        questions: [
          {
            question: "What does HTML stand for?",
            options: ["HyperText Markup Language", "Hyper Transfer Markup Language", "HighText Machine Learning"],
            correctAnswer: "HyperText Markup Language",
          },
          {
            question: "Which tag is used for the largest heading?",
            options: ["<h1>", "<h6>", "<header>", "<h3>"],
            correctAnswer: "<h1>",
          },
          {
            question: "Which HTML attribute specifies an alternate text for an image, if the image cannot be displayed?",
            options: ["alt", "title", "src", "img"],
            correctAnswer: "alt",
          },
          {
            question: "Which HTML element is used to display a list of items?",
            options: ["<ol>", "<li>", "<ul>", "<dl>"],
            correctAnswer: "<ul>",
          },
          {
            question: "What does the `<br>` tag do?",
            options: ["Line break", "Bold text", "Link", "Create a list"],
            correctAnswer: "Line break",
          },
        ],
      },
    ],
  },
  {
    careerPath: "Web Development",
    level: "intermediate",
    tests: [
      {
        testName: "CSS Fundamentals",
        questions: [
          {
            question: "Which CSS property controls text color?",
            options: ["font-color", "text-color", "color", "background-color"],
            correctAnswer: "color",
          },
          {
            question: "Which CSS property is used to change the font size?",
            options: ["font-size", "text-size", "size", "text-font"],
            correctAnswer: "font-size",
          },
          {
            question: "Which property is used to change the background color of an element?",
            options: ["background-color", "bg-color", "color", "background"],
            correctAnswer: "background-color",
          },
          {
            question: "How do you add a comment in CSS?",
            options: ["// comment", "# comment", "/* comment */", "<!-- comment -->"],
            correctAnswer: "/* comment */",
          },
          {
            question: "Which CSS property is used for setting the space between elements?",
            options: ["margin", "padding", "spacing", "border"],
            correctAnswer: "margin",
          },
        ],
      },
    ],
  },
  {
    careerPath: "Web Development",
    level: "advanced",
    tests: [
      {
        testName: "JavaScript Basics",
        questions: [
          {
            question: "Which method is used to create a new element in JavaScript?",
            options: ["createElement()", "newElement()", "append()", "addElement()"],
            correctAnswer: "createElement()",
          },
          {
            question: "Which keyword is used to declare a variable in JavaScript?",
            options: ["var", "let", "const", "all of the above"],
            correctAnswer: "all of the above",
          },
          {
            question: "Which operator is used to assign a value to a variable?",
            options: ["=", "==", "===", ":="],
            correctAnswer: "=",
          },
          {
            question: "Which function is used to parse a string into an integer?",
            options: ["parse()", "parseInt()", "int()", "toInteger()"],
            correctAnswer: "parseInt()",
          },
          {
            question: "What is the use of the `this` keyword in JavaScript?",
            options: ["Refers to the current object", "Refers to the global object", "Refers to the parent function", "Refers to the window object"],
            correctAnswer: "Refers to the current object",
          },
        ],
      },
    ],
  },

  // Data Science
  {
    careerPath: "Data Science",
    level: "beginner",
    tests: [
      {
        testName: "Python Basics",
        questions: [
          {
            question: "Which data type is mutable?",
            options: ["Tuple", "List", "String", "Integer"],
            correctAnswer: "List",
          },
          {
            question: "Which function is used to find the length of a list in Python?",
            options: ["len()", "length()", "size()", "count()"],
            correctAnswer: "len()",
          },
          {
            question: "What is the correct file extension for Python files?",
            options: [".py", ".pyt", ".pyth", ".python"],
            correctAnswer: ".py",
          },
          {
            question: "Which of these is used to handle exceptions in Python?",
            options: ["try-catch", "throw-catch", "try-except", "error-catch"],
            correctAnswer: "try-except",
          },
          {
            question: "Which library is commonly used for data manipulation in Python?",
            options: ["NumPy", "Pandas", "Matplotlib", "Seaborn"],
            correctAnswer: "Pandas",
          },
        ],
      },
    ],
  },
  {
    careerPath: "Data Science",
    level: "intermediate",
    tests: [
      {
        testName: "Statistics Fundamentals",
        questions: [
          {
            question: "What is the measure of central tendency?",
            options: ["Mean", "Variance", "Standard Deviation", "Range"],
            correctAnswer: "Mean",
          },
          {
            question: "Which term is used to describe the spread of data?",
            options: ["Variance", "Mean", "Mode", "Median"],
            correctAnswer: "Variance",
          },
          {
            question: "Which of the following is a type of hypothesis test?",
            options: ["T-test", "Z-test", "Chi-square", "All of the above"],
            correctAnswer: "All of the above",
          },
          {
            question: "What is a p-value in hypothesis testing?",
            options: ["Probability of the null hypothesis", "The margin of error", "The test statistic", "The probability of observing the data given the null hypothesis"],
            correctAnswer: "The probability of observing the data given the null hypothesis",
          },
          {
            question: "What does the normal distribution curve look like?",
            options: ["Symmetrical bell curve", "Asymmetrical", "Skewed", "Bimodal"],
            correctAnswer: "Symmetrical bell curve",
          },
        ],
      },
    ],
  },
  {
    careerPath: "Data Science",
    level: "advanced",
    tests: [
      {
        testName: "Machine Learning Basics",
        questions: [
          {
            question: "Which algorithm is used for classification?",
            options: ["K-Means", "Linear Regression", "Random Forest", "PCA"],
            correctAnswer: "Random Forest",
          },
          {
            question: "What is the purpose of cross-validation in machine learning?",
            options: ["Model evaluation", "Feature selection", "Hyperparameter tuning", "Model deployment"],
            correctAnswer: "Model evaluation",
          },
          {
            question: "Which machine learning algorithm is unsupervised?",
            options: ["K-Means", "Logistic Regression", "Linear Regression", "Naive Bayes"],
            correctAnswer: "K-Means",
          },
          {
            question: "Which of these is a supervised learning algorithm?",
            options: ["K-Means", "Random Forest", "Hierarchical Clustering", "Principal Component Analysis"],
            correctAnswer: "Random Forest",
          },
          {
            question: "What does the confusion matrix measure?",
            options: ["Model accuracy", "Model precision", "Model recall", "Performance of a classifier"],
            correctAnswer: "Performance of a classifier",
          },
        ],
      },
    ],
  },

  // Machine Learning
  {
    careerPath: "Machine Learning",
    level: "beginner",
    tests: [
      {
        testName: "Introduction to ML",
        questions: [
          {
            question: "What is Machine Learning?",
            options: ["A programming language", "A subset of AI", "A type of database", "A software testing method"],
            correctAnswer: "A subset of AI",
          },
          {
            question: "Which of the following is an example of supervised learning?",
            options: ["K-Means", "Linear Regression", "PCA", "Clustering"],
            correctAnswer: "Linear Regression",
          },
          {
            question: "What is overfitting in Machine Learning?",
            options: ["When the model performs well on both training and testing data", "When the model learns the noise in training data", "When the model performs poorly on both data", "When the model cannot be trained"],
            correctAnswer: "When the model learns the noise in training data",
          },
          {
            question: "What is a training set used for?",
            options: ["To train the model", "To test the model", "To evaluate the model", "None of the above"],
            correctAnswer: "To train the model",
          },
          {
            question: "Which algorithm is used for classification in machine learning?",
            options: ["K-Nearest Neighbors", "K-Means", "Linear Regression", "Logistic Regression"],
            correctAnswer: "K-Nearest Neighbors",
          },
        ],
      },
    ],
  },
  {
    careerPath: "Machine Learning",
    level: "intermediate",
    tests: [
      {
        testName: "Supervised vs Unsupervised Learning",
        questions: [
          {
            question: "Which of the following is an example of unsupervised learning?",
            options: ["Decision Trees", "K-Means", "Logistic Regression", "SVM"],
            correctAnswer: "K-Means",
          },
          {
            question: "Which of the following is a regression algorithm?",
            options: ["K-Nearest Neighbors", "Linear Regression", "SVM", "K-Means"],
            correctAnswer: "Linear Regression",
          },
          {
            question: "Which technique is used to improve a machine learning model’s accuracy?",
            options: ["Ensemble methods", "Feature selection", "Regularization", "All of the above"],
            correctAnswer: "All of the above",
          },
          {
            question: "Which of the following is a non-parametric algorithm?",
            options: ["Linear Regression", "K-Nearest Neighbors", "SVM", "Naive Bayes"],
            correctAnswer: "K-Nearest Neighbors",
          },
          {
            question: "What does an SVM do?",
            options: ["Classifies data into categories", "Reduces data dimensions", "Clustering data", "None of the above"],
            correctAnswer: "Classifies data into categories",
          },
        ],
      },
    ],
  },
  {
    careerPath: "Machine Learning",
    level: "advanced",
    tests: [
      {
        testName: "Neural Networks",
        questions: [
          {
            question: "Which activation function is commonly used in hidden layers?",
            options: ["ReLU", "Softmax", "Sigmoid", "Tanh"],
            correctAnswer: "ReLU",
          },
          {
            question: "What is the purpose of dropout in neural networks?",
            options: ["To reduce overfitting", "To improve accuracy", "To increase computation time", "To speed up the model"],
            correctAnswer: "To reduce overfitting",
          },
          {
            question: "Which of the following is a type of neural network?",
            options: ["Convolutional Neural Network", "Random Forest", "Support Vector Machine", "Decision Tree"],
            correctAnswer: "Convolutional Neural Network",
          },
          {
            question: "Which technique is used in transfer learning?",
            options: ["Using a pre-trained model", "Data augmentation", "Ensemble methods", "Cross-validation"],
            correctAnswer: "Using a pre-trained model",
          },
          {
            question: "Which of the following algorithms is used in reinforcement learning?",
            options: ["Q-learning", "Linear Regression", "K-Means", "Decision Trees"],
            correctAnswer: "Q-learning",
          },
        ],
      },
    ],
  },

  // Artificial Intelligence
  {
    careerPath: "Artificial Intelligence",
    level: "beginner",
    tests: [
      {
        testName: "Introduction to AI",
        questions: [
          {
            question: "What does AI stand for?",
            options: ["Artificial Intelligence", "Automated Interface", "Artificial Instruction", "Automatic Interaction"],
            correctAnswer: "Artificial Intelligence",
          },
          {
            question: "Which algorithm is used in AI for decision-making?",
            options: ["K-Means", "Decision Trees", "Linear Regression", "Clustering"],
            correctAnswer: "Decision Trees",
          },
          {
            question: "Which of the following is a component of AI?",
            options: ["Machine Learning", "Deep Learning", "Natural Language Processing", "All of the above"],
            correctAnswer: "All of the above",
          },
          {
            question: "What is a neural network used for?",
            options: ["Data storage", "Data processing", "Data analysis", "Pattern recognition"],
            correctAnswer: "Pattern recognition",
          },
          {
            question: "What type of problem does AI mainly solve?",
            options: ["Classification", "Clustering", "Prediction", "All of the above"],
            correctAnswer: "All of the above",
          },
        ],
      },
    ],
  },
  {
    careerPath: "Artificial Intelligence",
    level: "intermediate",
    tests: [
      {
        testName: "AI Algorithms",
        questions: [
          {
            question: "Which technique is used for supervised learning in AI?",
            options: ["K-Means", "Support Vector Machines", "Neural Networks", "Principal Component Analysis"],
            correctAnswer: "Support Vector Machines",
          },
          {
            question: "Which of the following is used in reinforcement learning?",
            options: ["Q-learning", "K-Means", "Random Forest", "SVM"],
            correctAnswer: "Q-learning",
          },
          {
            question: "Which AI algorithm is used for image recognition?",
            options: ["Convolutional Neural Networks", "Random Forest", "Logistic Regression", "Decision Trees"],
            correctAnswer: "Convolutional Neural Networks",
          },
          {
            question: "What does NLP stand for in AI?",
            options: ["Natural Language Processing", "Non-Linear Programming", "Network Logic Programming", "Natural Learning Process"],
            correctAnswer: "Natural Language Processing",
          },
          {
            question: "What is a feature in machine learning?",
            options: ["An input variable", "An output variable", "The result of a training process", "The accuracy of a model"],
            correctAnswer: "An input variable",
          },
        ],
      },
    ],
  },
  {
    careerPath: "Artificial Intelligence",
    level: "advanced",
    tests: [
      {
        testName: "Deep Learning",
        questions: [
          {
            question: "Which activation function is most commonly used in deep learning?",
            options: ["ReLU", "Sigmoid", "Tanh", "Softmax"],
            correctAnswer: "ReLU",
          },
          {
            question: "Which of the following is a type of deep neural network?",
            options: ["Convolutional Neural Networks", "Random Forest", "K-Nearest Neighbors", "Decision Trees"],
            correctAnswer: "Convolutional Neural Networks",
          },
          {
            question: "What does LSTM stand for in deep learning?",
            options: ["Long Short-Term Memory", "Low Short-Term Memory", "Layered Short-Term Memory", "Linear Short-Term Memory"],
            correctAnswer: "Long Short-Term Memory",
          },
          {
            question: "What is the purpose of backpropagation in neural networks?",
            options: ["To update weights", "To reduce overfitting", "To improve accuracy", "To speed up training"],
            correctAnswer: "To update weights",
          },
          {
            question: "Which deep learning technique is used in NLP tasks?",
            options: ["RNN", "CNN", "Decision Trees", "SVM"],
            correctAnswer: "RNN",
          },
        ],
      },
    ],
  },
  {
    careerPath: "Cloud Computing",
    level: "beginner",
    tests: [
      {
        testName: "Cloud Computing Basics",
        questions: [
          {
            question: "What is Cloud Computing?",
            options: ["Storing data on physical servers", "On-demand access to computing resources", "A type of operating system", "None of the above"],
            correctAnswer: "On-demand access to computing resources",
          },
          {
            question: "Which of the following is a cloud service provider?",
            options: ["Amazon Web Services", "Microsoft Azure", "Google Cloud", "All of the above"],
            correctAnswer: "All of the above",
          },
          {
            question: "Which of the following is an example of Infrastructure as a Service (IaaS)?",
            options: ["Amazon EC2", "Google App Engine", "Salesforce", "Dropbox"],
            correctAnswer: "Amazon EC2",
          },
          {
            question: "What is a public cloud?",
            options: ["Cloud owned by a third-party provider", "Cloud owned by a company for internal use", "Cloud for storing personal data", "None of the above"],
            correctAnswer: "Cloud owned by a third-party provider",
          },
          {
            question: "Which of the following is a benefit of Cloud Computing?",
            options: ["Cost savings", "Scalability", "Access to cutting-edge technologies", "All of the above"],
            correctAnswer: "All of the above",
          },
        ],
      },
    ],
  },
  {
    careerPath: "Cloud Computing",
    level: "intermediate",
    tests: [
      {
        testName: "Intermediate Cloud Computing",
        questions: [
          {
            question: "What is the key difference between IaaS, PaaS, and SaaS?",
            options: ["The level of control and management required by the user", "The number of services offered", "The storage capacity", "None of the above"],
            correctAnswer: "The level of control and management required by the user",
          },
          {
            question: "What is a Virtual Private Cloud (VPC)?",
            options: ["A private cloud in a data center", "A network of virtualized resources within a public cloud", "A cloud computing model", "None of the above"],
            correctAnswer: "A network of virtualized resources within a public cloud",
          },
          {
            question: "What is auto-scaling in cloud computing?",
            options: ["Automatically adjusting resources based on demand", "Automatically upgrading your cloud plan", "Automatically scaling up your software", "None of the above"],
            correctAnswer: "Automatically adjusting resources based on demand",
          },
          {
            question: "Which of the following is an example of Platform as a Service (PaaS)?",
            options: ["Google App Engine", "Amazon S3", "Microsoft Azure Storage", "Dropbox"],
            correctAnswer: "Google App Engine",
          },
          {
            question: "What is a cloud load balancer used for?",
            options: ["Distribute traffic evenly across servers", "Manage cloud security", "Store data in the cloud", "None of the above"],
            correctAnswer: "Distribute traffic evenly across servers",
          },
        ],
      },
    ],
  },
  {
    careerPath: "Cloud Computing",
    level: "advanced",
    tests: [
      {
        testName: "Advanced Cloud Computing",
        questions: [
          {
            question: "What is a container in cloud computing?",
            options: ["A method to store data", "A type of cloud storage", "A lightweight, portable, and self-sufficient environment for running applications", "None of the above"],
            correctAnswer: "A lightweight, portable, and self-sufficient environment for running applications",
          },
          {
            question: "Which protocol is used in cloud networking to ensure security of data transfer?",
            options: ["HTTPS", "FTP", "HTTP", "TCP"],
            correctAnswer: "HTTPS",
          },
          {
            question: "What is the role of a cloud orchestration tool?",
            options: ["To automate cloud resource management", "To monitor cloud security", "To store cloud data", "None of the above"],
            correctAnswer: "To automate cloud resource management",
          },
          {
            question: "What is multi-cloud strategy?",
            options: ["Using multiple cloud providers for better reliability and avoiding vendor lock-in", "Using a single cloud provider", "Storing data in multiple regions", "None of the above"],
            correctAnswer: "Using multiple cloud providers for better reliability and avoiding vendor lock-in",
          },
          {
            question: "What is cloud-native architecture?",
            options: ["Designing applications to take full advantage of cloud environments", "A type of cloud computing", "Storing data in the cloud", "None of the above"],
            correctAnswer: "Designing applications to take full advantage of cloud environments",
          },
        ],
      },
    ],
  },
  
  {
    careerPath: "Cyber Security",
    level: "beginner",
    tests: [
      {
        testName: "Cyber Security Basics",
        questions: [
          {
            question: "What is a firewall?",
            options: ["A type of security software", "A network security device", "A password manager", "All of the above"],
            correctAnswer: "A network security device",
          },
          {
            question: "What does 'phishing' refer to?",
            options: ["A type of malware", "An online scam", "A network protocol", "A security protocol"],
            correctAnswer: "An online scam",
          },
          {
            question: "What is a VPN?",
            options: ["Virtual Private Network", "Virtual Protocol Network", "Variable Private Network", "None of the above"],
            correctAnswer: "Virtual Private Network",
          },
          {
            question: "What is malware?",
            options: ["A type of antivirus software", "A malicious software designed to harm or exploit systems", "A network security protocol", "None of the above"],
            correctAnswer: "A malicious software designed to harm or exploit systems",
          },
          {
            question: "What does 'two-factor authentication' involve?",
            options: ["A password and username", "A password and a physical security token", "A password and a biometric scan", "None of the above"],
            correctAnswer: "A password and a physical security token",
          },
        ],
      },
    ],
  },
  {
    careerPath: "Cyber Security",
    level: "intermediate",
    tests: [
      {
        testName: "Intermediate Cyber Security",
        questions: [
          {
            question: "What is a DDoS attack?",
            options: ["A data theft attack", "A denial of service attack", "A phishing attack", "A brute force attack"],
            correctAnswer: "A denial of service attack",
          },
          {
            question: "What is encryption?",
            options: ["Converting data into a readable format", "Converting data into an unreadable format for security", "Storing data securely", "None of the above"],
            correctAnswer: "Converting data into an unreadable format for security",
          },
          {
            question: "Which of the following is a type of social engineering attack?",
            options: ["Phishing", "SQL Injection", "Cross-Site Scripting", "None of the above"],
            correctAnswer: "Phishing",
          },
          {
            question: "What is the purpose of a honeypot in cybersecurity?",
            options: ["Attracting and trapping malicious activity", "Encrypting data", "Monitoring network traffic", "None of the above"],
            correctAnswer: "Attracting and trapping malicious activity",
          },
          {
            question: "What is a Zero-Day vulnerability?",
            options: ["A vulnerability that has just been discovered", "A vulnerability that has been patched", "A known vulnerability", "None of the above"],
            correctAnswer: "A vulnerability that has just been discovered",
          },
        ],
      },
    ],
  },
  {
    careerPath: "Cyber Security",
    level: "advanced",
    tests: [
      {
        testName: "Advanced Cyber Security",
        questions: [
          {
            question: "What is an APT (Advanced Persistent Threat)?",
            options: ["A type of malware", "A targeted, long-term attack", "A firewall configuration", "None of the above"],
            correctAnswer: "A targeted, long-term attack",
          },
          {
            question: "What is multi-factor authentication?",
            options: ["A method of authentication using two or more independent credentials", "A password-based authentication", "A network security protocol", "None of the above"],
            correctAnswer: "A method of authentication using two or more independent credentials",
          },
          {
            question: "What is the role of a Security Information and Event Management (SIEM) system?",
            options: ["To store user data", "To detect and respond to security threats in real time", "To manage network traffic", "None of the above"],
            correctAnswer: "To detect and respond to security threats in real time",
          },
          {
            question: "What is the purpose of penetration testing?",
            options: ["To identify security vulnerabilities by simulating attacks", "To encrypt data", "To store data securely", "None of the above"],
            correctAnswer: "To identify security vulnerabilities by simulating attacks",
          },
          {
            question: "What is the concept of 'least privilege' in cybersecurity?",
            options: ["Allowing the highest level of access", "Giving users only the minimum level of access required", "Encrypting all data", "None of the above"],
            correctAnswer: "Giving users only the minimum level of access required",
          },
        ],
      },
    ],
  },

  {
    careerPath: "DSA",
    level: "beginner",
    tests: [
      {
        testName: "Basic DSA Concepts",
        questions: [
          {
            question: "What is an array?",
            options: ["A collection of elements", "A type of function", "A kind of loop", "None of the above"],
            correctAnswer: "A collection of elements",
          },
          {
            question: "What is the time complexity of binary search?",
            options: ["O(log n)", "O(n)", "O(n^2)", "O(1)"],
            correctAnswer: "O(log n)",
          },
          {
            question: "What is a linked list?",
            options: ["A collection of nodes where each node points to the next", "A type of array", "A kind of loop", "None of the above"],
            correctAnswer: "A collection of nodes where each node points to the next",
          },
          {
            question: "What is the primary use of a stack?",
            options: ["LIFO (Last In, First Out)", "FIFO (First In, First Out)", "Sorting data", "None of the above"],
            correctAnswer: "LIFO (Last In, First Out)",
          },
          {
            question: "Which of the following is a searching algorithm?",
            options: ["Linear Search", "Merge Sort", "Bubble Sort", "All of the above"],
            correctAnswer: "Linear Search",
          },
        ],
      },
    ],
  },
  {
    careerPath: "DSA",
    level: "intermediate",
    tests: [
      {
        testName: "Intermediate DSA Concepts",
        questions: [
          {
            question: "What is a binary tree?",
            options: ["A tree data structure with at most two children per node", "A type of array", "A graph", "None of the above"],
            correctAnswer: "A tree data structure with at most two children per node",
          },
          {
            question: "What is the time complexity of quicksort in the average case?",
            options: ["O(n log n)", "O(n^2)", "O(log n)", "O(n)"],
            correctAnswer: "O(n log n)",
          },
          {
            question: "What is a hash table?",
            options: ["A data structure that stores key-value pairs", "A type of array", "A binary search tree", "None of the above"],
            correctAnswer: "A data structure that stores key-value pairs",
          },
          {
            question: "What does a priority queue do?",
            options: ["Stores elements in a sorted order", "Stores elements in a random order", "Stores elements in a heap structure", "None of the above"],
            correctAnswer: "Stores elements in a sorted order",
          },
          {
            question: "What is dynamic programming?",
            options: ["Solving problems by breaking them down into simpler sub-problems", "Storing and reusing the results of sub-problems", "Both A and B", "None of the above"],
            correctAnswer: "Both A and B",
          },
        ],
      },
    ],
  },
  {
    careerPath: "DSA",
    level: "advanced",
    tests: [
      {
        testName: "Advanced DSA Concepts",
        questions: [
          {
            question: "What is the time complexity of Dijkstra's algorithm for finding the shortest path?",
            options: ["O(V^2)", "O(E + V log V)", "O(V log V)", "O(E log V)"],
            correctAnswer: "O(E + V log V)",
          },
          {
            question: "What is a graph traversal algorithm?",
            options: ["Breadth-First Search", "Depth-First Search", "Both A and B", "None of the above"],
            correctAnswer: "Both A and B",
          },
          {
            question: "What is the primary difference between a min-heap and a max-heap?",
            options: ["The order of the elements", "The time complexity of insertions", "The space complexity", "None of the above"],
            correctAnswer: "The order of the elements",
          },
          {
            question: "What is the purpose of the Bellman-Ford algorithm?",
            options: ["To find the shortest paths from a single source to all other vertices", "To sort elements", "To find the longest path", "None of the above"],
            correctAnswer: "To find the shortest paths from a single source to all other vertices",
          },
          {
            question: "What is a Trie used for?",
            options: ["Efficient storage of strings", "Searching for elements in an array", "Graph traversal", "None of the above"],
            correctAnswer: "Efficient storage of strings",
          },
        ],
      },
    ],
  },

];

  Assessment.insertMany(assessments).then(() => console.log("Data Inserted"));
  
  

// Insert Roadmaps
async function insertRoadmaps() {
  try {
    const roadmaps = [
      // Web Development
      new Roadmap({
        careerPath: "Web Development",
        levels: {
          beginner: [
            { topic: "HTML & CSS Basics", duration: "2 weeks" },
            { topic: "JavaScript Fundamentals", duration: "3 weeks" },
            { topic: "Version Control (Git & GitHub)", duration: "1 week" },
          ],
          intermediate: [
            { topic: "Frontend Framework (React, Vue, or Angular)", duration: "4 weeks" },
            { topic: "Backend Basics (Node.js, Express)", duration: "3 weeks" },
            { topic: "Databases (MongoDB, SQL)", duration: "3 weeks" },
          ],
          advanced: [
            { topic: "Authentication & Security (JWT, OAuth)", duration: "2 weeks" },
            { topic: "Scalability & Deployment (AWS, Docker, CI/CD)", duration: "3 weeks" },
            { topic: "Performance Optimization & Caching", duration: "3 weeks" },
          ],
        },
      }),

      // Data Science
      new Roadmap({
        careerPath: "Data Science",
        levels: {
          beginner: [
            { topic: "Python Programming Basics", duration: "2 weeks" },
            { topic: "Data Analysis with Pandas & NumPy", duration: "3 weeks" },
            { topic: "Data Visualization (Matplotlib, Seaborn)", duration: "2 weeks" },
          ],
          intermediate: [
            { topic: "Statistics & Probability for Data Science", duration: "3 weeks" },
            { topic: "SQL for Data Analysis", duration: "2 weeks" },
            { topic: "Machine Learning Basics (Supervised & Unsupervised)", duration: "4 weeks" },
          ],
          advanced: [
            { topic: "Deep Learning with TensorFlow & PyTorch", duration: "4 weeks" },
            { topic: "Big Data & Spark", duration: "3 weeks" },
            { topic: "Deploying ML Models (Flask, FastAPI, Docker)", duration: "3 weeks" },
          ],
        },
      }),

      // Machine Learning
      new Roadmap({
        careerPath: "Machine Learning",
        levels: {
          beginner: [
            { topic: "Python Basics for ML", duration: "2 weeks" },
            { topic: "Linear Algebra & Calculus Essentials", duration: "2 weeks" },
            { topic: "Introduction to Machine Learning", duration: "2 weeks" },
          ],
          intermediate: [
            { topic: "Supervised & Unsupervised Learning", duration: "3 weeks" },
            { topic: "Model Evaluation & Tuning", duration: "2 weeks" },
            { topic: "Feature Engineering & Pipelines", duration: "2 weeks" },
          ],
          advanced: [
            { topic: "Deep Learning Models (CNN, RNN)", duration: "4 weeks" },
            { topic: "Reinforcement Learning Basics", duration: "3 weeks" },
            { topic: "Model Deployment & MLOps", duration: "3 weeks" },
          ],
        },
      }),

      // Artificial Intelligence
      new Roadmap({
        careerPath: "Artificial Intelligence",
        levels: {
          beginner: [
            { topic: "Foundations of AI", duration: "2 weeks" },
            { topic: "Python & Logic Programming", duration: "2 weeks" },
            { topic: "Search Algorithms (DFS, BFS, A*)", duration: "2 weeks" },
          ],
          intermediate: [
            { topic: "Knowledge Representation & Inference", duration: "3 weeks" },
            { topic: "Planning & Decision Making", duration: "3 weeks" },
            { topic: "Intro to NLP and CV", duration: "3 weeks" },
          ],
          advanced: [
            { topic: "Deep Learning for AI", duration: "4 weeks" },
            { topic: "Generative AI (GANs, Transformers)", duration: "4 weeks" },
            { topic: "Ethics & Safety in AI", duration: "2 weeks" },
          ],
        },
      }),

      // DSA
      new Roadmap({
        careerPath: "DSA",
        levels: {
          beginner: [
            { topic: "Time & Space Complexity", duration: "1 week" },
            { topic: "Arrays & Strings", duration: "2 weeks" },
            { topic: "Stacks & Queues", duration: "2 weeks" },
          ],
          intermediate: [
            { topic: "Linked Lists & HashMaps", duration: "2 weeks" },
            { topic: "Trees & Graphs", duration: "3 weeks" },
            { topic: "Recursion & Backtracking", duration: "2 weeks" },
          ],
          advanced: [
            { topic: "Dynamic Programming", duration: "3 weeks" },
            { topic: "Greedy & Divide-Conquer Algorithms", duration: "2 weeks" },
            { topic: "Advanced Graphs (Dijkstra, Floyd-Warshall)", duration: "2 weeks" },
          ],
        },
      }),

      // Cybersecurity
      new Roadmap({
        careerPath: "Cybersecurity",
        levels: {
          beginner: [
            { topic: "Basics of Network Security", duration: "2 weeks" },
            { topic: "Cryptography Fundamentals", duration: "2 weeks" },
            { topic: "Common Attacks (Phishing, Malware)", duration: "2 weeks" },
          ],
          intermediate: [
            { topic: "System & Web Application Security", duration: "3 weeks" },
            { topic: "Firewalls, IDS & VPNs", duration: "2 weeks" },
            { topic: "Security Audits & Risk Management", duration: "2 weeks" },
          ],
          advanced: [
            { topic: "Ethical Hacking & Penetration Testing", duration: "3 weeks" },
            { topic: "Incident Response & Forensics", duration: "3 weeks" },
            { topic: "Security Compliance (ISO, GDPR)", duration: "2 weeks" },
          ],
        },
      }),

      // Cloud Computing
      new Roadmap({
        careerPath: "Cloud Computing",
        levels: {
          beginner: [
            { topic: "Intro to Cloud & Service Models (IaaS, PaaS, SaaS)", duration: "2 weeks" },
            { topic: "Virtualization & Containers", duration: "2 weeks" },
            { topic: "AWS/GCP/Azure Basics", duration: "2 weeks" },
          ],
          intermediate: [
            { topic: "Cloud Storage & Databases", duration: "2 weeks" },
            { topic: "IAM & Security in Cloud", duration: "3 weeks" },
            { topic: "Serverless & Microservices", duration: "3 weeks" },
          ],
          advanced: [
            { topic: "CI/CD with Cloud", duration: "3 weeks" },
            { topic: "Monitoring & Logging", duration: "2 weeks" },
            { topic: "Cloud Architecture & Best Practices", duration: "3 weeks" },
          ],
        },
      }),
    ];

    await Roadmap.insertMany(roadmaps);
    console.log("✅ Roadmaps inserted successfully!");
  } catch (err) {
    console.error("❌ Error inserting roadmaps:", err);
  }
}


// Insert Courses
async function insertCourses() {
  try {
    const courses = [
      // Web Development
      { careerPath: "Web Development", level: "beginner", name: "HTML & CSS Basics", link: "https://www.w3schools.com/html/" },
      { careerPath: "Web Development", level: "beginner", name: "JavaScript Essentials", link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" },
      { careerPath: "Web Development", level: "intermediate", name: "React for Beginners", link: "https://react.dev/" },
      { careerPath: "Web Development", level: "advanced", name: "Full Stack Web Development", link: "https://fullstackopen.com/en/" },

      // Data Science
      { careerPath: "Data Science", level: "beginner", name: "Python for Data Science", link: "https://www.coursera.org/learn/python-data-analysis" },
      { careerPath: "Data Science", level: "intermediate", name: "Data Analysis with Pandas", link: "https://www.datacamp.com/courses/pandas-foundations" },
      { careerPath: "Data Science", level: "advanced", name: "Machine Learning with Scikit-Learn", link: "https://scikit-learn.org/stable/tutorial/index.html" },

      // Machine Learning
      { careerPath: "Machine Learning", level: "beginner", name: "Machine Learning Crash Course", link: "https://developers.google.com/machine-learning/crash-course" },
      { careerPath: "Machine Learning", level: "intermediate", name: "Deep Learning Specialization", link: "https://www.coursera.org/specializations/deep-learning" },
      { careerPath: "Machine Learning", level: "advanced", name: "Reinforcement Learning", link: "https://www.udacity.com/course/deep-reinforcement-learning-nanodegree--nd893" },

      // Artificial Intelligence (AI)
      { careerPath: "AI", level: "beginner", name: "AI For Everyone by Andrew Ng", link: "https://www.coursera.org/learn/ai-for-everyone" },
      { careerPath: "AI", level: "intermediate", name: "Artificial Intelligence Nanodegree", link: "https://www.udacity.com/course/artificial-intelligence-nanodegree--nd898" },
      { careerPath: "AI", level: "advanced", name: "Advanced AI: Planning and Decision Making", link: "https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-034-artificial-intelligence-fall-2010/" },

      // Data Structures and Algorithms (DSA)
      { careerPath: "DSA", level: "beginner", name: "Introduction to Algorithms", link: "https://www.khanacademy.org/computing/computer-science/algorithms" },
      { careerPath: "DSA", level: "intermediate", name: "DSA with JavaScript", link: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" },
      { careerPath: "DSA", level: "advanced", name: "Competitive Programming Course", link: "https://codeforces.com/blog/entry/57282" },

      // Cybersecurity
      { careerPath: "Cybersecurity", level: "beginner", name: "Introduction to Cybersecurity", link: "https://www.netacad.com/courses/cybersecurity/introduction-cybersecurity" },
      { careerPath: "Cybersecurity", level: "intermediate", name: "CompTIA Security+ Certification", link: "https://www.coursera.org/professional-certificates/comptia-security-plus" },
      { careerPath: "Cybersecurity", level: "advanced", name: "Offensive Security Certified Professional (OSCP)", link: "https://www.offensive-security.com/pwk-oscp/" },
      
          // Cloud Computing
      { careerPath: "Cloud Computing", level: "beginner", name: "Cloud Computing Basics", link: "https://www.coursera.org/learn/cloud-computing-basics" },
      { careerPath: "Cloud Computing", level: "intermediate", name: "Architecting with Google Cloud", link: "https://www.coursera.org/professional-certificates/architecting-with-google-cloud" },
      { careerPath: "Cloud Computing", level: "advanced", name: "AWS Certified Solutions Architect – Professional", link: "https://www.aws.training/Details/Curriculum?id=20685" },

    ];

    await Course.insertMany(courses);
    console.log("✅ Courses inserted successfully!");
  } catch (error) {
    console.error("❌ Error inserting courses:", error);
  }
}


// Initialize Database Seeding
async function seedDatabase() {
  await connectDB();
  await insertRoadmaps();
  await insertCourses();
  mongoose.connection.close();
  console.log("✅ Database seeding complete. Connection closed.");
}

// Start Express Server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  seedDatabase();
});
