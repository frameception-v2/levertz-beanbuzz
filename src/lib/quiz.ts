export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export const coffeeQuiz: QuizQuestion[] = [
  {
    question: "Which country is the largest producer of coffee in the world?",
    options: ["Colombia", "Vietnam", "Brazil", "Ethiopia"],
    correctAnswer: 2
  },
  {
    question: "What is the name of the process of removing the outer layers of a coffee cherry?",
    options: ["Roasting", "Grinding", "Pulping", "Brewing"],
    correctAnswer: 2
  },
  {
    question: "Which coffee brewing method was invented in Italy in 1884?",
    options: ["French Press", "Espresso Machine", "Drip Coffee", "Moka Pot"],
    correctAnswer: 1
  },
  {
    question: "What is the name of the foam that forms on top of an espresso?",
    options: ["Crema", "Foam", "Froth", "Cream"],
    correctAnswer: 0
  },
  {
    question: "Which coffee variety is known for its low caffeine content?",
    options: ["Robusta", "Arabica", "Liberica", "Excelsa"],
    correctAnswer: 1
  }
];
