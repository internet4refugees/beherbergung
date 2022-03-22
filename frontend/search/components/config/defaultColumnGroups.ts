const groups = [
  { name: "editStatus", header: "Last Edit" },
  { name: "contactStatus", header: "Contact Status" },
  { name: "offerStatus", header: "Offer Status" },
  { name: "locationCoarse", header: "Location" },
  { name: "distance", group: "locationCoarse", header: "Distance" },
  { name: "time", header: "Time" },
  { name: "features", header: "Limitations / Features" },
  { name: "animals", group: "features", header: "Animals" },
  { name: "contact", header: "Contact" },
  { name: "address", group: "contact", header: "Address" },
];

export default groups;
