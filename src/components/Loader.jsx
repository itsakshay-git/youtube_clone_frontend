
/**
 * Loader component that displays a bouncing animation to indicate loading status.
 * 
 * @component
 * @returns {JSX.Element} The Loader component.
 * 
 * @description 
 * This component renders a loading spinner with three bouncing dots. It's styled with Tailwind CSS
 * to center the dots vertically and horizontally on the screen, with a "Loading..." text below.
 * The animation for the bouncing dots is achieved using Tailwind's `animate-bounce` class with custom
 * animation delays for a staggered effect.
 */

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
      <div className="flex space-x-2 mb-4">
        <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce"></div>
      </div>
      <p className="text-sm text-gray-400">Loading...</p>
    </div>
  );
};

export default Loader;
