# Calendar React Component - ReadMe

This React Calendar component is a versatile and customizable tool designed to help you manage and visualize events. It leverages the [date-fns](https://date-fns.org/) library for date manipulation and provides a clean and responsive user interface.

## Features

1. **Intuitive Navigation:**
   - Navigate to the current month with a single click.
   - Move between months using intuitive navigation buttons.

2. **Dark Mode:**
   - Toggle between light and dark mode for a personalized viewing experience.

3. **Real-Time Clock Indicator:**
   - The current time is dynamically displayed on the calendar, updating every second.
   - A visual indicator represents the current time's progression throughout the day.

4. **Event Management:**
   - Easily add new events with a click on the "+ Add" button.
   - Edit or delete existing events for seamless event management.

5. **Event Sorting:**
   - Events are sorted chronologically, considering start times and whether they are all-day events.
   - All-day events are visually distinct from timed events.

6. **Responsive Design:**
   - The calendar is designed to adapt to various screen sizes, ensuring a seamless user experience across devices.

## Getting Started

### Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/mmnsrti/calender.git
cd calender
npm install
```

### Run the Application

Start the development server:

```bash
npm start
```

Visit `http://localhost:3000` in your browser to view the calendar.

## Usage

1. **Navigate:**
   - Use the "Today" button to quickly navigate to the current month.
   - Click the arrows ("<" and ">") to move to the previous or next month.

2. **Event Management:**
   - Click on any day to view and manage events for that day.
   - The "+ Add" button allows you to add new events to the selected day.
   - Events are displayed in chronological order, with options to edit or delete them.

3. **Dark Mode:**
   - Enable or disable Dark Mode by toggling the switch.

## Customization

- **Date Formatting:**
  - Date formatting is handled by the `date-fns` library. Customize the date format in the `formatDate` utility function found in `utils/formatDate.js`.

- **Styling:**
  - Adjust the styling by modifying the CSS classes in the `styles` directory.

## Dependencies

- **React:** A JavaScript library for building user interfaces.
- **date-fns:** A library for handling dates in JavaScript.

## Contributing

Feel free to contribute to the project by opening issues or submitting pull requests. Follow the guidelines in the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## License

This project is licensed under the [MIT License](LICENSE).

---

Thank you for using and contributing to the Calendar React Component! If you have any questions or feedback, please open an issue on GitHub.