"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const events = [
    {
      id: "1",
      title: "React Course Session",
      date: "2024-01-15",
      time: "10:00 AM",
      duration: "2 hours",
      type: "course",
      attendees: 15,
      location: "Online",
    },
    {
      id: "2",
      title: "Team Meeting",
      date: "2024-01-16",
      time: "2:00 PM",
      duration: "1 hour",
      type: "meeting",
      attendees: 8,
      location: "Conference Room A",
    },
    {
      id: "3",
      title: "Python Certification Exam",
      date: "2024-01-18",
      time: "9:00 AM",
      duration: "3 hours",
      type: "exam",
      attendees: 1,
      location: "Online",
    },
    {
      id: "4",
      title: "Networking Event",
      date: "2024-01-20",
      time: "6:00 PM",
      duration: "2 hours",
      type: "event",
      attendees: 50,
      location: "Tech Hub Downtown",
    },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    return events.filter((event) => event.date === dateString);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "course":
        return "bg-blue-500";
      case "meeting":
        return "bg-green-500";
      case "exam":
        return "bg-red-500";
      case "event":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Calendar</h1>
          <p className="text-gray-400">Manage your schedule and events</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Event
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6"
          >
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentDate(
                      new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth() - 1
                      )
                    )
                  }
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    setCurrentDate(
                      new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth() + 1
                      )
                    )
                  }
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Day Headers */}
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="p-2 text-center text-gray-400 text-sm font-medium"
                >
                  {day}
                </div>
              ))}

              {/* Calendar Days */}
              {days.map((day, index) => {
                if (!day) {
                  return <div key={index} className="p-2" />;
                }

                const dayEvents = getEventsForDate(day);
                const isSelected =
                  selectedDate.toDateString() === day.toDateString();
                const isToday =
                  new Date().toDateString() === day.toDateString();

                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDate(day)}
                    className={`p-2 min-h-[80px] text-left border rounded-lg transition-colors ${
                      isSelected
                        ? "bg-green-600 text-white border-green-500"
                        : isToday
                        ? "bg-green-600/20 text-white border-green-500/50"
                        : "bg-gray-700/50 text-white border-gray-600 hover:bg-gray-700"
                    }`}
                  >
                    <div className="text-sm font-medium mb-1">
                      {day.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className={`w-full h-2 rounded ${getEventTypeColor(
                            event.type
                          )}`}
                          title={event.title}
                        />
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-400">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Events Panel */}
        <div className="space-y-6">
          {/* Selected Date Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h3>

            {selectedDateEvents.length === 0 ? (
              <p className="text-gray-400 text-sm">
                No events scheduled for this date
              </p>
            ) : (
              <div className="space-y-3">
                {selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 bg-gray-700/50 rounded-lg border-l-4 border-green-500"
                  >
                    <h4 className="text-white font-medium text-sm mb-1">
                      {event.title}
                    </h4>
                    <div className="space-y-1 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {event.time} • {event.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{event.attendees} attendees</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              Upcoming Events
            </h3>
            <div className="space-y-3">
              {events.slice(0, 3).map((event) => (
                <div key={event.id} className="p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm mb-1">
                        {event.title}
                      </h4>
                      <p className="text-gray-400 text-xs">
                        {event.date} • {event.time}
                      </p>
                    </div>
                    <div
                      className={`w-3 h-3 rounded-full ${getEventTypeColor(
                        event.type
                      )}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
