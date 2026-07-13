"use client";

import React, { useState } from "react";
import LayoutWrapper from "@/components/hypertrophy/LayoutWrapper";
import DashboardOverview from "@/components/hypertrophy/DashboardOverview";
import AnatomyViewer from "@/components/hypertrophy/AnatomyViewer";
import ExerciseDatabase from "@/components/hypertrophy/ExerciseDatabase";
import WorkoutPlanner from "@/components/hypertrophy/WorkoutPlanner";
import RecoveryManager from "@/components/hypertrophy/RecoveryManager";
import NutritionPlanner from "@/components/hypertrophy/NutritionPlanner";
import ProgressTracker from "@/components/hypertrophy/ProgressTracker";
import AiCoachChat from "@/components/hypertrophy/AiCoachChat";
import EducationCenter from "@/components/hypertrophy/EducationCenter";

export default function HypertrophyPage() {
  const [currentTab, setCurrentTab] = useState("overview");

  const renderContent = () => {
    switch (currentTab) {
      case "overview":
        return <DashboardOverview onTabChange={(tab) => setCurrentTab(tab)} />;
      case "anatomy":
        return <AnatomyViewer />;
      case "exercises":
        return <ExerciseDatabase />;
      case "planner":
        return <WorkoutPlanner />;
      case "recovery":
        return <RecoveryManager />;
      case "nutrition":
        return <NutritionPlanner />;
      case "progress":
        return <ProgressTracker />;
      case "coach":
        return <AiCoachChat />;
      case "academy":
        return <EducationCenter />;
      default:
        return <DashboardOverview onTabChange={(tab) => setCurrentTab(tab)} />;
    }
  };

  return (
    <LayoutWrapper currentTab={currentTab} onTabChange={(tab) => setCurrentTab(tab)}>
      {renderContent()}
    </LayoutWrapper>
  );
}
