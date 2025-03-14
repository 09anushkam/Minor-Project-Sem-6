const mongoose = require("mongoose");

// Connect to MongoDB
const MONGO_URL = "mongodb://127.0.0.1:27017/SMA";

main()
    .then((res) => {
        console.log("Connected to DB");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

const Experiment = require('../models/Experiment');

// Fake Experiment Data
const experiments = [
    {
        no: 1,
        title: "Newton's Laws of Motion",
        aim: "Understand Newton's three laws of motion.",
        theory: "Newton’s laws explain the motion of objects...",
        procedure: "Step 1: Set up the experiment...",
        simulation: "Interactive simulation link here...",
        quiz: "Q1: What is Newton’s first law?",
        references: "1. Physics Book by XYZ...",
        feedback: "Your feedback is valuable."
    },
    {
        no: 2,
        title: "Ohm's Law",
        aim: "Verify Ohm's Law using a simple circuit.",
        theory: "Ohm's Law states that V = IR...",
        procedure: "Step 1: Connect the resistor...",
        simulation: "Interactive Ohm's Law simulation...",
        quiz: "Q1: What is the formula for Ohm's Law?",
        references: "1. Electrical Engineering Book...",
        feedback: "Your feedback is valuable."
    },
    {
        no: 3,
        title: "Archimedes' Principle",
        aim: "Study the buoyant force on an object in a fluid.",
        theory: "Archimedes' Principle explains why objects float...",
        procedure: "Step 1: Submerge the object...",
        simulation: "Buoyancy simulation link...",
        quiz: "Q1: What happens when an object is submerged?",
        references: "1. Fluid Mechanics by XYZ...",
        feedback: "Your feedback is valuable."
    },
    {
        no: 4,
        title: "Laws of Reflection",
        aim: "Understand how light reflects from surfaces.",
        theory: "The angle of incidence equals the angle of reflection...",
        procedure: "Step 1: Place a mirror at an angle...",
        simulation: "Light reflection simulation...",
        quiz: "Q1: What is the law of reflection?",
        references: "1. Optics Book by ABC...",
        feedback: "Your feedback is valuable."
    },
    {
        no: 5,
        title: "Boyle's Law",
        aim: "Understand the relationship between pressure and volume.",
        theory: "Boyle’s Law states that PV = constant...",
        procedure: "Step 1: Reduce the volume of a gas...",
        simulation: "Gas law simulation...",
        quiz: "Q1: What is Boyle’s Law?",
        references: "1. Thermodynamics by XYZ...",
        feedback: "Your feedback is valuable."
    },
    {
        no: 6,
        title: "Faraday's Law of Electromagnetic Induction",
        aim: "Explore electromagnetic induction.",
        theory: "A changing magnetic field induces a current...",
        procedure: "Step 1: Move a magnet near a coil...",
        simulation: "Electromagnetic induction simulation...",
        quiz: "Q1: What is Faraday’s Law?",
        references: "1. Electromagnetism by XYZ...",
        feedback: "Your feedback is valuable."
    },
    {
        no: 7,
        title: "Hooke's Law",
        aim: "Study the relationship between force and extension in springs.",
        theory: "Hooke’s Law states that F = kx...",
        procedure: "Step 1: Attach weights to the spring...",
        simulation: "Spring elasticity simulation...",
        quiz: "Q1: What is Hooke’s Law?",
        references: "1. Mechanics by ABC...",
        feedback: "Your feedback is valuable."
    },
    {
        no: 8,
        title: "Bernoulli's Principle",
        aim: "Understand the relationship between pressure and velocity in fluids.",
        theory: "Bernoulli’s Principle explains fluid motion...",
        procedure: "Step 1: Observe fluid flow in a pipe...",
        simulation: "Bernoulli simulation...",
        quiz: "Q1: What does Bernoulli’s Principle state?",
        references: "1. Fluid Dynamics by XYZ...",
        feedback: "Your feedback is valuable."
    }
];

// Insert Data into MongoDB
const insertData = async () => {
    try {
        await Experiment.deleteMany({});
        await Experiment.insertMany(experiments);
        console.log("Experiment data inserted successfully!");
        mongoose.connection.close();
    } catch (error) {
        console.error("Error inserting data:", error);
        mongoose.connection.close();
    }
};

insertData();
