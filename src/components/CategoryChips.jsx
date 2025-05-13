import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * @file CategoryChips.js
 * @description A component that displays a set of category chips (buttons) that allow users to select a category. The component supports horizontal scrolling for categories.
 */

/**
 * CategoryChips component for displaying category chips with horizontal scrolling functionality.
 * @component
 * @param {Object} props - The component's props.
 * @param {Array<string>} props.categories - An array of category names to display as chips.
 * @param {string} props.selected - The currently selected category.
 * @param {function} props.onSelect - A callback function that is triggered when a category chip is selected.
 * @example
 * <CategoryChips
 *   categories={["Technology", "Music", "Sports"]}
 *   selected="Music"
 *   onSelect={(category) => console.log(`Selected: ${category}`)}
 * />
 */

function CategoryChips({ categories, selected, onSelect }) {
  const scrollRef = useRef();

  /**
   * Scrolls the category chips left or right.
   * @function
   * @param {string} dir - The direction to scroll, either "left" or "right".
   * @returns {void}
   */

  const scroll = (dir) => {
    const scrollAmount = 200;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="sticky top-0 z-40 bg-white">
      <div className="relative flex items-center bg-white px-4 py-2 overflow-hidden">
        {/* Scroll Buttons */}
        <button
          className="absolute left-0 z-10 bg-white px-2 py-1"
          onClick={() => scroll("left")}
        >
          <ChevronLeft />
        </button>

        {/* Chips wrapper with max-width and hidden overflow */}
        <div className="mx-6 w-full overflow-hidden">
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide whitespace-nowrap"
          >
            {["All", ...categories].map((cat, i) => (
              <button
                key={i}
                onClick={() => onSelect(cat)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                  selected === cat ? "bg-black text-white" : "bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 z-10 bg-white px-2 py-1"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}

export default CategoryChips;
