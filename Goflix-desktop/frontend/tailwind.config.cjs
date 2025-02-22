/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "gradient-xy": "gradient-xy 3s ease infinite",
        "blob": "blob 7s infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "slide-down": "slide-down 0.5s ease-out",
        "slide-left": "slide-left 0.5s ease-out",
        "slide-right": "slide-right 0.5s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-center": "slide-center 0.3s ease-out",
        "slide-top": "slide-top 0.3s ease-out",
        "slide-bottom": "slide-bottom 0.3s ease-out",
        "slide-top-left": "slide-top-left 0.3s ease-out",
        "slide-top-right": "slide-top-right 0.3s ease-out",
        "slide-bottom-left": "slide-bottom-left 0.3s ease-out",
        "slide-bottom-right": "slide-bottom-right 0.3s ease-out",
        "splash-out": "splash-out 1.5s ease-out forwards"
      },
      keyframes: {
        "gradient-xy": {
          "0%, 100%": {
            "background-size": "400% 400%",
            "background-position": "left center"
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center"
          }
        },
        "blob": {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" }
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        "slide-down": {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        "slide-left": {
          "0%": { transform: "translateX(-100px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" }
        },
        "slide-right": {
          "0%": { transform: "translateX(100px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" }
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "slide-center": {
          "0%": { transform: "translate(-50%, -50%) scale(0.95)", opacity: "0" },
          "100%": { transform: "translate(-50%, -50%) scale(1)", opacity: "1" }
        },
        "slide-top": {
          "0%": { transform: "translate(-50%, -120%)", opacity: "0" },
          "100%": { transform: "translate(-50%, 0%)", opacity: "1" }
        },
        "slide-bottom": {
          "0%": { transform: "translate(-50%, 120%)", opacity: "0" },
          "100%": { transform: "translate(-50%, 0%)", opacity: "1" }
        },
        "slide-top-left": {
          "0%": { transform: "translate(-120%, -120%)", opacity: "0" },
          "100%": { transform: "translate(0%, 0%)", opacity: "1" }
        },
        "slide-top-right": {
          "0%": { transform: "translate(120%, -120%)", opacity: "0" },
          "100%": { transform: "translate(0%, 0%)", opacity: "1" }
        },
        "slide-bottom-left": {
          "0%": { transform: "translate(-120%, 120%)", opacity: "0" },
          "100%": { transform: "translate(0%, 0%)", opacity: "1" }
        },
        "slide-bottom-right": {
          "0%": { transform: "translate(120%, 120%)", opacity: "0" },
          "100%": { transform: "translate(0%, 0%)", opacity: "1" }
        },
        "splash-out": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(1.5)", opacity: "0" }
        }
      }
    }
  },
  variants: {
    extend: {
      scale: ["active", "group-hover"],
      opacity: ["group-hover"]
    }
  },
  plugins: []
};
