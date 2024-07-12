const db = require("./app/models");
const User = db.user;
const Role = db.role;
const Education = db.education;
const Experience = db.experience;
const ExperienceType = db.experienceType;
const Goal = db.goal;
const JobDescription = db.jobDescription;
const Link = db.link;
const Skill = db.skill;
const Resume = db.resume;
const { encrypt, getSalt, hashPassword } = require("./app/authentication/crypto");

//default values
//create when first construct table and ensure items did not exist before create
exports.create = async () => {
  //default roles
  Role.findOrCreate({
    where : {id : 1},
    defaults: {
      title : "Administrator"
    }
  });
  //default roles
  Role.findOrCreate({
    where : {id : 2},
    defaults: {
      title : "Career Service"
    }
  });
  //default roles
  Role.findOrCreate({
    where : {id : 3},
    defaults: {
      title : "Student"
    }
  });

  //default Experience Type
  ExperienceType.findOrCreate({
    where : {id : 1},
    defaults: {
      title : "Work Experience"
    }
  });
  //default Experience Type
  ExperienceType.findOrCreate({
    where : {id : 2},
    defaults: {
      title : "Internship Experience"
    }
  });
  //default Experience Type
  ExperienceType.findOrCreate({
    where : {id : 3},
    defaults: {
      title : "Project Experience"
    }
  });
  //default Experience Type
  ExperienceType.findOrCreate({
    where : {id : 4},
    defaults: {
      title : "Leadership Experience"
    }
  });
  //default Experience Type
  ExperienceType.findOrCreate({
    where : {id : 5},
    defaults: {
      title : "Honor Experience"
    }
  });

    //admin user
  let salt = await getSalt();
  let hash = await hashPassword("password", salt);
  User.findOrCreate({
    where: { id: 1 },
    defaults: {
      userName: 'Admin',
      email: "Admin@email.com",
      firstName: "Admin",
      lastName : "user",
      address: "In this web",
      phoneNumber: "555-555-555",
      roleId : 1,
      darkMode: false,
      password: hash,
      salt: salt
    },
  });
}//end function

exports.testCreate = async () => {
  let salt = await getSalt();
  let hash = await hashPassword("password", salt);
  // Career Services user
  User.findOrCreate({
    where: { id: 2 },
    defaults: {
      userName: 'Career',
      email: "career.services@email.com",
      firstName: "Career",
      lastName : "user",
      address: "In this web",
      phoneNumber: "555-555-555",
      roleId : 2,
      darkMode: false,
      password: hash,
      salt: salt
    },
  });

  salt = await getSalt();
  hash = await hashPassword("password", salt);
  // Student user
  User.findOrCreate({
    where: { id: 3 },
    defaults: {
      userName: 'Student',
      email: "student@email.com",
      firstName: "Student",
      lastName : "user",
      address: "In this web",
      phoneNumber: "555-555-555",
      roleId : 3,
      darkMode: false,
      password: hash,
      salt: salt
    },
  });

  // Education
  Education.findOrCreate({
    where: { id: 1 },
    defaults: {
      title: "BSCS",
      description: "Bachelor of Science in Computer Science at Oklahoma Christian University",
      userId: 3,
      startDate: "8/15/2018",
      endDate: "4/25/2022",
      gradDate: "4/25/2022",
      gpa: 4.00,
      organization: "Oklahoma Christian",
      city: "Edmond",
      state: "OK",
      courses: "Programming 1 and 2, OOP, OS, Software Engineering 1 through 5, Internet Apps, Mobile Apps",
      minor: "None",
      totalGPA: 4.00
    },
  });

  Education.findOrCreate({
    where: { id: 2 },
    defaults: {
      title: "MSCS",
      description: "Master of Science in Computer Science at Oklahoma State University",
      userId: 3,
      startDate: "9/3/2022",
      endDate: "5/15/2024",
      gradDate: "5/15/2024",
      gpa: 4.00,
      organization: "Oklahoma State University",
      city: "Stillwater",
      state: "OK",
      courses: "Parallel Programming, Artificial Intelligence",
      minor: "None",
      totalGPA: 4.00
    },
  });

  // Experience
  Experience.findOrCreate({
    where: { id: 1 },
    defaults: {
      title: "Internship at Tinker AFB",
      description: "Embedded Internship with the 76th Software Engineering Group",
      userId: 3,
      startDate: "6/1/2020",
      endDate: "8/8/2020",
      organization: "Tinker AFB",
      city: "Midwest City",
      state: "OK",
      experienceTypeId: 1
    },
  });

  Experience.findOrCreate({
    where: { id: 2 },
    defaults: {
      title: "Paycom Internship",
      description: "Internship with Paycom",
      userId: 3,
      startDate: "6/1/2022",
      endDate: "8/8/2022",
      organization: "Paycom",
      city: "Oklahoma City",
      state: "OK",
      experienceTypeId: 1
    },
  });

  // Goal
  Goal.findOrCreate({
    where: { id: 1 },
    defaults: {
      title: "Main Professional Summary",
      description: "\"A dedicated Software Engineer with a passion for innovation and a commitment to driving technical success. Demonstrated expertise in software development and a strong foundation in programming languages. As a former intern at Tinker AFB, I actively contributed to the Software Group, showcasing my ability to collaborate in a professional environment. I have also excelled in academic pursuits, graduating magna cum laude and serving as club president during my college years, reflecting my leadership skills and dedication to excellence. Eager to join a dynamic team where I can leverage my technical knowledge and problem-solving abilities to contribute to impactful software solutions.\"",
      userId: 3,
      chatHistory: []
    },
  });

  // Job Description
  JobDescription.findOrCreate({
    where: { id: 1 },
    defaults: {
      title: "Software Engineering Job",
      description: "We are seeking a talented and motivated Software Engineer to join our dynamic development team. As a Software Engineer at our company, you will be responsible for developing our code base. Key Responsibilities: Design, develop, and implement software solutions that meet business requirements; Collaborate with cross-functional teams to define, design, and ship new features; Write clean, maintainable, and efficient code; Participate in code reviews and ensure code quality; Test and deploy applications and systems; Revise, update, refactor, and debug code; Improve existing software by analyzing and identifying areas for modification; Document development phases and monitor systems.\n\nRequired Skills and Qualifications: Bachelor's degree in Computer Science, Engineering, or a related field (or equivalent work experience); Proven hands-on software development experience; Proficiency in one or more programming languages (e.g., Python, Java, C++, etc.; Strong understanding of data structures, algorithms, and object-oriented design; Experience with software development methodologies (e.g., Agile, Scrum, etc.); Knowledge of relational databases, SQL, and ORM technologies; Excellent analytical and problem-solving skills; Ability to work independently and as part of a team; Strong communication skills and ability to collaborate effectively with stakeholders\n\nPreferred Qualifications: Master's degree in Computer Science or related field; Experience with cloud platforms (e.g., AWS, Azure, Google Cloud); Familiarity with front-end development (HTML, CSS, JavaScript); Experience with version control systems (e.g., Git, SVN); Knowledge of containerization and orchestration technologies (e.g., Docker, Kubernetes)",
      userId: 3
    },
  });

  // Link
  Link.findOrCreate({
    where: { id: 1 },
    defaults: {
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      type: "Joke",
      userId: 3
    },
  });

  // SKill
  Skill.findOrCreate({
    where: { id: 1 },
    defaults: {
      title: "Programming Languages",
      description: "Experience with C#, JS, C++, Java, and Python programming languages",
      userId: 3
    },
  });

  Skill.findOrCreate({
    where: { id: 2 },
    defaults: {
      title: "Languages",
      description: "Experience with the Spanish language",
      userId: 3
    },
  });

  Resume.findOrCreate({
    where: { id: 1 },
    defaults: {
      title: "Resume 1",
      content: "Objective: A dedicated and detail-oriented software developer with [number] years of experience in designing, developing, and maintaining software applications. Seeking to leverage technical skills and strong problem-solving abilities to contribute effectively to [Company Name]’s development team.\n\nEducation: BS in Computer Science; Oklhoma State University, Stillwater, OK\n\nTechnical Skills: Programming Languages: Python, Java, C++, C#; Web Development: HTML/CSS, JavaScript, React, Angular, etc.; Database Management: MySQL;Tools & Technologies: Git, SVN; IDEs Visual Studio Code, IntelliJ IDEA; Operating Systems: Windows, Linux\n\nProfessional Experience:\nSoftware Developer: Collaborated with cross-functional teams to deliver high-quality software solutions. Conducted code reviews and provided constructive feedback to team members. Participated in Agile sprint planning, stand-ups, and retrospectives. \nSoftware Engineering Intern: Assisted in the development and testing of a Unity Simulation. Learned and applied Scrum methodologies, Unity in C# and Visual Studio. Contributed to team discussions and brainstorming sessions.",
      goalId: 1,
      experienceId: [1],
      skillId: [1, 2],
      educationId: [1, 2],
      linkId: [1],
      template: 4,
      editing: false,
      comments: "",
      rating: "",
      userId: 3
    }
  });
}
