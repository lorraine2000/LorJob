"use client";

import { useEffect } from "react";
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";

export default function OnboardingTour() {
  useEffect(() => {
    // Vérifie si le tutoriel a déjà été vu

    const hasSeenTour = localStorage.getItem("hasSeenTour");
    if (hasSeenTour === "true") localStorage.removeItem("hasSeenTour");

    const tour = new Shepherd.Tour({
      defaultStepOptions: {
        cancelIcon: { enabled: true },
        classes: "shadow-md bg-purple-dark p-4 rounded shepherd-custom",
        scrollTo: { behavior: "smooth", block: "center" },
      },
    });

    if (window.innerWidth < 768) {
    tour.addStep({
      id: "sidebar-trigger",
      text: "Appuie ici pour ouvrir le menu de navigation.",
      classes: "shepherd-mobile",
      attachTo: {
        element: "#sidebar-trigger",
        on: "bottom",
      },
      buttons: [
        {
          text: "Suivant",
          action: tour.next,
        },
      ],
    });
  }

    tour.addStep({
      id: "user-profile",
      text: "Ici, tu peux consulter ton profil, te déconnecter ou supprimer définitivement ton compte. Prends le temps avant de cliquer sur Supprimer, cette action est irréversible.",
      attachTo: {
        element: "#user-profile",
        on: "top",
      },
      buttons: [
        {
          text: "Terminé",
          action: tour.complete,
        },
      ],
    });

    // Marque le tutoriel comme vu quand il se termine
    tour.on("complete", () => {
      localStorage.setItem("hasSeenTour", "true");
    });

    // Lance le tutoriel
    setTimeout(() => {
      tour.start();
      localStorage.setItem("hasSeenTour", "true");
    }, 500);
  }, []);

  return null;
}
