"use client";
import { useState } from "react";
import { FaRobot } from "react-icons/fa";
import AiBox from "../sections/ai-box";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setAiOpen } from "@/redux/features/appState-slice";

function AiButton() {
  const isOpen = useSelector((state: RootState) => state.appState.isAiOpen);
  const dispatch = useDispatch();

  return (
    <div>
      {!isOpen ? (
        <button
          onClick={() => dispatch(setAiOpen(true))}
          className="fixed  right-10 bottom-10 p-4 rounded-full bg-primary text-white hover:scale-90 duration-75 "
        >
          <FaRobot size={40} />
        </button>
      ) : (
        <div>
          <AiBox />
        </div>
      )}
    </div>
  );
}

export default AiButton;
