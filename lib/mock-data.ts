export type CategoryId = 'books' | 'electronics' | 'notes' | 'skills' | 'tickets' | 'giveaways';

export type ListingType = 'free' | 'exchange' | 'paid';

export interface Category {
  id: CategoryId;
  label: string;
  icon: string;
  gradient: string;
  glowColor: string;
  count: number;
}

export interface Student {
  id: string;
  name: string;
  regNo: string;
  dept: string;
  year: number;
  avatarGradient: string;
}

export interface Listing {
  id: string;
  title: string;
  category: CategoryId;
  description: string;
  type: ListingType;
  price: number | null;
  student: Student;
  postedDate: string;
  gradient: string;
}

export interface ConnectRequest {
  id: string;
  listingId: string;
  listingTitle: string;
  requester: Student;
  message: string;
  date: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface AppNotification {
  id: string;
  type: 'request' | 'listing' | 'system';
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export const categories: Category[] = [
  { id: 'books', label: 'Books', icon: 'BookOpen', gradient: 'from-violet-500 to-purple-600', glowColor: 'rgba(124, 58, 237, 0.35)', count: 187 },
  { id: 'electronics', label: 'Electronics', icon: 'Cpu', gradient: 'from-cyan-500 to-blue-600', glowColor: 'rgba(6, 182, 212, 0.35)', count: 94 },
  { id: 'notes', label: 'Notes & Study Material', icon: 'FileText', gradient: 'from-amber-500 to-orange-600', glowColor: 'rgba(245, 158, 11, 0.35)', count: 156 },
  { id: 'skills', label: 'Skills', icon: 'Sparkles', gradient: 'from-emerald-500 to-teal-600', glowColor: 'rgba(16, 185, 129, 0.35)', count: 42 },
  { id: 'tickets', label: 'Event Tickets', icon: 'Ticket', gradient: 'from-pink-500 to-rose-600', glowColor: 'rgba(236, 72, 153, 0.35)', count: 23 },
  { id: 'giveaways', label: 'Giveaways', icon: 'Gift', gradient: 'from-indigo-500 to-violet-600', glowColor: 'rgba(99, 102, 241, 0.35)', count: 68 },
];

export const categoryGlowMap: Record<CategoryId, string> = {
  books: 'rgba(124, 58, 237, 0.3)',
  electronics: 'rgba(6, 182, 212, 0.3)',
  notes: 'rgba(245, 158, 11, 0.3)',
  skills: 'rgba(16, 185, 129, 0.3)',
  tickets: 'rgba(236, 72, 153, 0.3)',
  giveaways: 'rgba(99, 102, 241, 0.3)',
};

export const categoryGradientMap: Record<CategoryId, string> = {
  books: 'from-violet-600 via-purple-700 to-indigo-800',
  electronics: 'from-cyan-600 via-blue-700 to-indigo-800',
  notes: 'from-amber-600 via-orange-700 to-red-800',
  skills: 'from-emerald-600 via-teal-700 to-cyan-800',
  tickets: 'from-pink-600 via-rose-700 to-red-800',
  giveaways: 'from-indigo-600 via-violet-700 to-purple-800',
};

export const students: Student[] = [
  { id: 's1', name: 'Aarav Sharma', regNo: 'RA2211003010123', dept: 'CSE', year: 3, avatarGradient: 'from-violet-500 to-purple-600' },
  { id: 's2', name: 'Priya Venkatesh', regNo: 'RA2211003010456', dept: 'ECE', year: 3, avatarGradient: 'from-cyan-500 to-blue-600' },
  { id: 's3', name: 'Rohan Gupta', regNo: 'RA2211003010789', dept: 'MECH', year: 2, avatarGradient: 'from-emerald-500 to-teal-600' },
  { id: 's4', name: 'Sneha Reddy', regNo: 'RA2211003010234', dept: 'IT', year: 4, avatarGradient: 'from-amber-500 to-orange-600' },
  { id: 's5', name: 'Karthik Nair', regNo: 'RA2211003010567', dept: 'AIDS', year: 2, avatarGradient: 'from-pink-500 to-rose-600' },
  { id: 's6', name: 'Ananya Iyer', regNo: 'RA2211003010890', dept: 'AIML', year: 3, avatarGradient: 'from-indigo-500 to-violet-600' },
  { id: 's7', name: 'Vikram Singh', regNo: 'RA2211003010345', dept: 'CSE', year: 4, avatarGradient: 'from-violet-500 to-cyan-500' },
  { id: 's8', name: 'Divya Krishnan', regNo: 'RA2211003010678', dept: 'CIVIL', year: 1, avatarGradient: 'from-cyan-500 to-emerald-500' },
];

export const currentUser: Student = students[0];

export const listings: Listing[] = [
  {
    id: '1',
    title: 'Calculus by Thomas — 3rd Sem',
    category: 'books',
    description: 'Thomas\' Calculus, 14th edition. Barely used, no annotations. Covers the full M3 syllabus for 3rd semester. Great condition — picked up from the book fair last semester.',
    type: 'exchange',
    price: null,
    student: students[0],
    postedDate: '2026-08-22',
    gradient: 'from-violet-600 via-purple-700 to-indigo-800',
  },
  {
    id: '2',
    title: 'Arduino Uno Kit — Complete',
    category: 'electronics',
    description: 'Full Arduino Uno R3 starter kit with breadboard, jumper wires, sensors (ultrasonic, temp, motion), servos, and LCD. Used for 2nd year mini project. Everything works perfectly.',
    type: 'paid',
    price: 850,
    student: students[1],
    postedDate: '2026-08-20',
    gradient: 'from-cyan-600 via-blue-700 to-indigo-800',
  },
  {
    id: '3',
    title: 'Notes: DBMS Unit 1-5 (Handwritten)',
    category: 'notes',
    description: 'Complete handwritten DBMS notes covering all 5 units — ER diagrams, normalization, SQL, transactions, indexing. Neatly organized with sticky tab markers. Helped me score an A+ last sem.',
    type: 'free',
    price: null,
    student: students[6],
    postedDate: '2026-08-24',
    gradient: 'from-amber-600 via-orange-700 to-red-800',
  },
  {
    id: '4',
    title: 'Riviera Fest Ticket — Day 2 Pass',
    category: 'tickets',
    description: 'Riviera 2026 Day 2 pass — covers the main stage concert + food court access. Can\'t attend due to internship interview clash. Transferring at face value.',
    type: 'paid',
    price: 300,
    student: students[3],
    postedDate: '2026-08-23',
    gradient: 'from-pink-600 via-rose-700 to-red-800',
  },
  {
    id: '5',
    title: 'Python & ML Tutoring (Weekend)',
    category: 'skills',
    description: 'Offering weekend tutoring sessions for Python basics and intro to ML. 3rd year AIML student, mentored 15+ juniors last year. First session free, then mutual skill exchange preferred.',
    type: 'exchange',
    price: null,
    student: students[5],
    postedDate: '2026-08-21',
    gradient: 'from-emerald-600 via-teal-700 to-cyan-800',
  },
  {
    id: '6',
    title: 'Engineering Drawing Kit (Free)',
    category: 'giveaways',
    description: 'Complete engineering drawing set — compass, set squares, protractor, French curves, mini drafter. Giving away since I switched to CAD full time. Pick up from NTT block.',
    type: 'free',
    price: null,
    student: students[2],
    postedDate: '2026-08-25',
    gradient: 'from-indigo-600 via-violet-700 to-purple-800',
  },
  {
    id: '7',
    title: 'OS Notes — Galvin + Previous Papers',
    category: 'notes',
    description: 'Operating Systems notes compiled from Galvin textbook + NPTEL lectures + solved previous year question papers (2022-2025). Digital PDF + printed summary sheets.',
    type: 'paid',
    price: 50,
    student: students[4],
    postedDate: '2026-08-19',
    gradient: 'from-amber-600 via-orange-700 to-red-800',
  },
  {
    id: '8',
    title: 'Logitech Wireless Mouse M331',
    category: 'electronics',
    description: 'Logitech M331 silent wireless mouse, 6 months old. Works flawlessly, USB receiver included. Selling because I upgraded to a gaming mouse. Battery life is excellent.',
    type: 'paid',
    price: 450,
    student: students[7],
    postedDate: '2026-08-18',
    gradient: 'from-cyan-600 via-sky-700 to-blue-800',
  },
  {
    id: '9',
    title: 'Data Structures in C — Reema Thareja',
    category: 'books',
    description: 'Data Structures Using C by Reema Thareja, 2nd edition. Excellent condition. Perfect for 2nd sem DSA course. Has my bookmarks in useful chapters but no writing inside.',
    type: 'exchange',
    price: null,
    student: students[3],
    postedDate: '2026-08-17',
    gradient: 'from-violet-600 via-purple-700 to-fuchsia-800',
  },
  {
    id: '10',
    title: 'Aaruush Volunteer Certificate Set',
    category: 'giveaways',
    description: 'Got multiple Aaruush event certificates + merchandise (t-shirt, badge, lanyard) from volunteering. Passing it to someone who collects these or needs them for portfolio. Free!',
    type: 'free',
    price: null,
    student: students[0],
    postedDate: '2026-08-16',
    gradient: 'from-indigo-600 via-blue-700 to-violet-800',
  },
  {
    id: '11',
    title: 'Engineering Physics — Serway Jewett',
    category: 'books',
    description: 'Engineering Physics textbook by Serway & Jewett. Used for 1st year physics course. Good condition with some highlighted chapters. Great for exam prep.',
    type: 'paid',
    price: 200,
    student: students[2],
    postedDate: '2026-08-15',
    gradient: 'from-violet-600 via-purple-700 to-indigo-800',
  },
  {
    id: '12',
    title: 'CN Notes — Tanenbaum + Slides',
    category: 'notes',
    description: 'Computer Networks notes compiled from Tanenbaum textbook, class slides, and lab manuals. Covers all 5 units with diagrams. Includes previous year solved papers.',
    type: 'free',
    price: null,
    student: students[6],
    postedDate: '2026-08-14',
    gradient: 'from-amber-600 via-orange-700 to-red-800',
  },
];

export const myListings: Listing[] = listings.filter((l) => l.student.id === currentUser.id);

export const initialSavedIds: string[] = ['2', '3', '5', '8'];

export const initialRequests: ConnectRequest[] = [
  {
    id: 'r1',
    listingId: '1',
    listingTitle: 'Calculus by Thomas — 3rd Sem',
    requester: students[4],
    message: 'Hey! I need this for M3 this semester. I have a Discrete Math textbook I can exchange — interested?',
    date: '2026-08-24',
    status: 'pending',
  },
  {
    id: 'r2',
    listingId: '10',
    listingTitle: 'Aaruush Volunteer Certificate Set',
    requester: students[7],
    message: 'I volunteered at Aaruush too but missed getting the merch. Would love to have these for my portfolio!',
    date: '2026-08-23',
    status: 'pending',
  },
  {
    id: 'r3',
    listingId: '1',
    listingTitle: 'Calculus by Thomas — 3rd Sem',
    requester: students[2],
    message: 'I have Thomas Calculus 13th edition already but need the 14th for the updated problem sets. Can we work something out?',
    date: '2026-08-22',
    status: 'pending',
  },
];

export const initialNotifications: AppNotification[] = [
  {
    id: 'n1',
    type: 'request',
    title: 'New connection request',
    description: 'Karthik Nair wants to connect on "Calculus by Thomas"',
    time: '2h ago',
    read: false,
  },
  {
    id: 'n2',
    type: 'listing',
    title: 'Your listing got 12 views',
    description: '"Aaruush Volunteer Certificate Set" is trending in Giveaways',
    time: '5h ago',
    read: false,
  },
  {
    id: 'n3',
    type: 'system',
    title: 'Welcome to SRMxchange',
    description: 'Complete your profile to get the Verified SRM Student badge',
    time: '1d ago',
    read: true,
  },
];

export function getListingById(id: string): Listing | undefined {
  return listings.find((l) => l.id === id);
}

export function getListingsByStudent(studentId: string): Listing[] {
  return listings.filter((l) => l.student.id === studentId);
}

export function getCategoryById(id: CategoryId): Category | undefined {
  return categories.find((c) => c.id === id);
}
