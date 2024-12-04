import { Link } from "react-router-dom";

export default function DropContentHome() {
  return (
    <div className="w-44">
      <div className="mb-3">
        <a href="#" className="block mt-3 p-2 hover:bg-gray-200 text-sm b">
          Home 1
        </a>
        <a href="#" className="block p-2 hover:bg-gray-200 text-sm">
          Home 2
        </a>
      </div>
    </div>
  );
}

export const DropContentDashBoard = () => {
  return (
    <div className="w-44">
      <div className="mb-3">
        <a
          href="#"
          className="block mt-3 p-2 hover:bg-gray-200 text-sm border-dotted "
        >
          1
        </a>
        <a href="#" className="block p-2 hover:bg-gray-200 text-sm">
          2
        </a>
      </div>
    </div>
  );
};

export const DropContentCourses = () => {
  return (
    <div className="w-44">
      <div className="mb-3">
        <a
          href="/popular_tours"
          className="block mt-3 p-2 hover:bg-gray-200 text-sm border-dotted "
        >
          Popular Tours
          </a>
        <a
          href="/hotel_booking"
          className="block p-2 hover:bg-gray-200 text-sm border-dotted "
        >
          Hotel
        </a>
        <a
          href="/plane_ticket"
          className="block p-2 hover:bg-gray-200 text-sm border-dotted "
        >
          Plane
        </a>
        <a
          href="/events"
          className="block p-2 hover:bg-gray-200 text-sm border-dotted "
        >
          Events
        </a>
      </div>
    </div>
  );
};
