import { icons } from "../constants/icons";

function CourseItem({
  courseName,
  state,
}: {
  courseName: string;
  state: string;
}) {
  return (
    <div className="flex flex-row items-center justify-vetween w-[90%] gap-x-2 p-4 border-b border-secondary-text-color mt-5">
      <img src={icons.tv} alt="Course Icon" className="size-8 mr-2" />
      <h3
        className={`text-xl ${
          state === "in progress"
            ? "text-gradient-start"
            : state === "completed"
            ? "text-success"
            : "text-primary-text-color"
        } font-bold`}
      >
        {courseName}
      </h3>
      {(state === "completed" || state === "in progress") && (
        <div
          className={`w-auto rounded-full ${
            state === "in progress"
              ? "bg-gradient-to-r from-gradient-start to-gradient-end"
              : state === "completed"
              ? "bg-success"
              : "bg-transparent"
          } py-1 text-xs px-4 text-center text-primary font-medium`}
        >
          {state.charAt(0).toUpperCase() + state.slice(1)}
        </div>
      )}
      <a className="text-secondary-text-color font-medium text-sm ml-auto border-b border-secondary-text-color hover:cursor-pointer">
        Edit
      </a>
    </div>
  );
}

export default CourseItem;
