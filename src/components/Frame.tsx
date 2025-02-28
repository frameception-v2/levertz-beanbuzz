"use client";

import { useEffect, useCallback, useState } from "react";
import sdk, {
  AddFrame,
  SignIn as SignInCore,
  type Context,
} from "@farcaster/frame-sdk";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";

import { config } from "~/components/providers/WagmiProvider";
import { truncateAddress } from "~/lib/truncateAddress";
import { base, optimism } from "wagmi/chains";
import { useSession } from "next-auth/react";
import { createStore } from "mipd";
import { Label } from "~/components/ui/label";
import { PROJECT_TITLE } from "~/lib/constants";

import { coffeeQuiz } from "~/lib/quiz";

function QuizCard() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<number[]>([]);

  const handleAnswer = (selectedOption: number) => {
    if (selectedOption === coffeeQuiz[currentQuestion].correctAnswer) {
      setScore(score + 1);
    } else {
      setWrongAnswers(prev => [...prev, currentQuestion + 1]);
    }

    if (currentQuestion < coffeeQuiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setWrongAnswers([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Coffee Knowledge Quiz</CardTitle>
        <CardDescription>
          Test your coffee knowledge with these questions!
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!showResults ? (
          <div className="space-y-4">
            <div className="text-sm font-medium">
              Question {currentQuestion + 1} of {coffeeQuiz.length}
            </div>
            <div className="font-medium">
              {coffeeQuiz[currentQuestion].question}
            </div>
            <div className="space-y-2">
              {coffeeQuiz[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className="w-full p-2 text-left border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => handleAnswer(index)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <div className="text-xl font-bold">
              Your Score: {score}/{coffeeQuiz.length}
            </div>
            {wrongAnswers.length > 0 && (
              <div className="text-sm">
                Missed questions: {wrongAnswers.join(', ')}
              </div>
            )}
            <button
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              onClick={resetQuiz}
            >
              Try Again
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Frame() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();

  const [added, setAdded] = useState(false);

  const [addFrameResult, setAddFrameResult] = useState("");

  const addFrame = useCallback(async () => {
    try {
      await sdk.actions.addFrame();
    } catch (error) {
      if (error instanceof AddFrame.RejectedByUser) {
        setAddFrameResult(`Not added: ${error.message}`);
      }

      if (error instanceof AddFrame.InvalidDomainManifest) {
        setAddFrameResult(`Not added: ${error.message}`);
      }

      setAddFrameResult(`Error: ${error}`);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      if (!context) {
        return;
      }

      setContext(context);
      setAdded(context.client.added);

      // If frame isn't already added, prompt user to add it
      if (!context.client.added) {
        addFrame();
      }

      sdk.on("frameAdded", ({ notificationDetails }) => {
        setAdded(true);
      });

      sdk.on("frameAddRejected", ({ reason }) => {
        console.log("frameAddRejected", reason);
      });

      sdk.on("frameRemoved", () => {
        console.log("frameRemoved");
        setAdded(false);
      });

      sdk.on("notificationsEnabled", ({ notificationDetails }) => {
        console.log("notificationsEnabled", notificationDetails);
      });
      sdk.on("notificationsDisabled", () => {
        console.log("notificationsDisabled");
      });

      sdk.on("primaryButtonClicked", () => {
        console.log("primaryButtonClicked");
      });

      console.log("Calling ready");
      sdk.actions.ready({});

      // Set up a MIPD Store, and request Providers.
      const store = createStore();

      // Subscribe to the MIPD Store.
      store.subscribe((providerDetails) => {
        console.log("PROVIDER DETAILS", providerDetails);
        // => [EIP6963ProviderDetail, EIP6963ProviderDetail, ...]
      });
    };
    if (sdk && !isSDKLoaded) {
      console.log("Calling load");
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded, addFrame]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      <div className="w-[300px] mx-auto py-2 px-2">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-700 dark:text-gray-300">
          {PROJECT_TITLE}
        </h1>
        <QuizCard />
      </div>
    </div>
  );
}
