// TypeScript data model and database for Hypertrophy AI app
// Contains 22 muscle groups, 30+ exercises, workout programs, recovery stats, warm-ups, and FAQs.

export interface Muscle {
  id: string;
  name: string;
  scientificName: string;
  group: 'Chest' | 'Back' | 'Shoulders' | 'Arms' | 'Core' | 'Legs' | 'Neck';
  description: string;
  origin: string;
  insertion: string;
  action: string;
  growDifficulty: 'Easy' | 'Medium' | 'Hard';
  recoveryTime: string;
  weeklySets: string;
  scientificNotes: string;
  exercises: string[];
}

export interface Exercise {
  id: string;
  name: string;
  primaryMuscle: string; // Muscle ID
  secondaryMuscles: string[]; // Muscle IDs
  activationPrimary: number; // percentage
  activationSecondary: number; // percentage
  equipment: 'Barbell' | 'Dumbbell' | 'Cable' | 'Machine' | 'Bodyweight';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  execution: string[];
  mistakes: string[];
  tempo: string; // e.g. "3-0-1-0"
  rom: string;
  rpe: number;
  rest: string;
  science: string;
  alternatives: string[]; // Alternative exercise names/IDs
  youtubeUrl: string;
}

export interface WorkoutDay {
  name: string;
  focus: string;
  exercises: {
    exerciseId: string;
    sets: number;
    reps: string;
    rpe: number;
    rest: string;
    notes: string;
  }[];
}

export interface WorkoutSplit {
  id: string;
  name: string;
  description: string;
  schedule: string; // e.g. "Monday: Chest/Triceps, Wednesday: Back/Biceps..."
  days: {
    weeks_1_4: WorkoutDay[];
    weeks_5_8: WorkoutDay[];
  };
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface WarmupItem {
  id: string;
  name: string;
  sets: string;
  repsTime: string;
  notes: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  category: 'Anatomy' | 'Science' | 'Programming';
  content: string[];
  illustrationText: string;
}

// 1. Muscle Groups Data
export const muscles: Muscle[] = [
  {
    id: 'chest',
    name: 'Chest (Pectoralis)',
    scientificName: 'Pectoralis Major & Minor',
    group: 'Chest',
    description: 'The chest consists of the pectoralis major and minor. It covers the chest wall and acts to bring the arms across the body.',
    origin: 'Clavicle, sternum, and ribs 1-6',
    insertion: 'Humerus (upper arm bone)',
    action: 'Shoulder horizontal adduction, internal rotation, and shoulder flexion (upper chest).',
    growDifficulty: 'Medium',
    recoveryTime: '48-72 hours',
    weeklySets: '12-20 sets',
    scientificNotes: 'Target using horizontal press variations and isolation flies. Keep shoulder blades retracted to maximize chest recruitment.',
    exercises: ['bench_press', 'db_incline_press', 'cable_flye', 'assisted_dip']
  },
  {
    id: 'upper_chest',
    name: 'Upper Chest',
    scientificName: 'Pectoralis Major (Clavicular Head)',
    group: 'Chest',
    description: 'The upper portion of the chest originating at the collarbone. It gives the upper torso a full, muscular appearance.',
    origin: 'Anterior surface of the clavicle',
    insertion: 'Greater tubercle of the humerus',
    action: 'Shoulder flexion (raising arm up) and shoulder adduction.',
    growDifficulty: 'Hard',
    recoveryTime: '48-72 hours',
    weeklySets: '6-10 sets (as part of chest volume)',
    scientificNotes: 'Best targeted with incline press variations (30-45 degree angle) and incline dumbbell flyes.',
    exercises: ['db_incline_press']
  },
  {
    id: 'lower_chest',
    name: 'Lower Chest',
    scientificName: 'Pectoralis Major (Sternal Head)',
    group: 'Chest',
    description: 'The larger, lower portion of the chest muscle originating at the sternum and rib cage.',
    origin: 'Anterior surface of the sternum, costal cartilages of ribs 1-6',
    insertion: 'Greater tubercle of the humerus',
    action: 'Shoulder horizontal adduction and shoulder extension.',
    growDifficulty: 'Easy',
    recoveryTime: '48-72 hours',
    weeklySets: '8-12 sets',
    scientificNotes: 'Recruited heavily in flat bench pressing, dips, and decline press variations.',
    exercises: ['bench_press', 'assisted_dip', 'cable_flye']
  },
  {
    id: 'shoulders',
    name: 'Shoulders (Deltoids)',
    scientificName: 'Deltoideus',
    group: 'Shoulders',
    description: 'A three-headed muscle covering the shoulder joint. Provides visual width and a capped, rounded look.',
    origin: 'Clavicle, acromion process, and spine of the scapula',
    insertion: 'Deltoid tuberosity of the humerus',
    action: 'Arm abduction (raising arm sideways), flexion (raising arm front), and horizontal abduction (pulling arm back).',
    growDifficulty: 'Medium',
    recoveryTime: '48-72 hours',
    weeklySets: '12-20 sets total',
    scientificNotes: 'Ensure balanced training across all three heads (anterior, lateral, posterior) for joint safety and aesthetics.',
    exercises: ['military_press', 'db_lateral_raise', 'seated_face_pull', 'cable_reverse_flye']
  },
  {
    id: 'front_delts',
    name: 'Front Delts',
    scientificName: 'Anterior Deltoid',
    group: 'Shoulders',
    description: 'The front portion of the shoulder muscle. It assists in pressing movements.',
    origin: 'Anterior border and upper surface of the lateral clavicle',
    insertion: 'Deltoid tuberosity of the humerus',
    action: 'Shoulder flexion and internal rotation.',
    growDifficulty: 'Easy',
    recoveryTime: '48 hours',
    weeklySets: '6-10 sets (receives high volume from compound pressing)',
    scientificNotes: 'Heavily active in bench press and shoulder press. Direct isolation is rarely needed for beginners.',
    exercises: ['military_press', 'db_incline_press', 'bench_press']
  },
  {
    id: 'side_delts',
    name: 'Side Delts',
    scientificName: 'Lateral Deltoid',
    group: 'Shoulders',
    description: 'The middle head of the shoulder. Responsible for lateral shoulder width (V-taper).',
    origin: 'Acromion process of the scapula',
    insertion: 'Deltoid tuberosity of the humerus',
    action: 'Shoulder abduction (lifting arms to the side).',
    growDifficulty: 'Hard',
    recoveryTime: '48 hours',
    weeklySets: '8-16 sets',
    scientificNotes: 'Responds best to lateral raises. Best loaded with cables or dumbbells to keep tension at various angles.',
    exercises: ['db_lateral_raise', 'cable_lateral_raise']
  },
  {
    id: 'rear_delts',
    name: 'Rear Delts',
    scientificName: 'Posterior Deltoid',
    group: 'Shoulders',
    description: 'The back head of the shoulder. Essential for upper back thickness and shoulder health.',
    origin: 'Lower lip of the posterior border of the spine of the scapula',
    insertion: 'Deltoid tuberosity of the humerus',
    action: 'Shoulder horizontal abduction and external rotation.',
    growDifficulty: 'Medium',
    recoveryTime: '48 hours',
    weeklySets: '8-14 sets',
    scientificNotes: 'Target with reverse flyes, face pulls, and pulling movements. Highly important for structural balance.',
    exercises: ['seated_face_pull', 'cable_reverse_flye', 'reverse_pec_deck']
  },
  {
    id: 'lats',
    name: 'Lats (Latissimus Dorsi)',
    scientificName: 'Latissimus Dorsi',
    group: 'Back',
    description: 'The largest muscle in the upper body, extending down the back. Creates a wide upper body silhouette.',
    origin: 'Spinous processes of T7-L5, thoracolumbar fascia, iliac crest, and lower ribs',
    insertion: 'Intertubercular groove of the humerus',
    action: 'Shoulder extension, adduction, and internal rotation.',
    growDifficulty: 'Medium',
    recoveryTime: '48-72 hours',
    weeklySets: '10-18 sets',
    scientificNotes: 'Train with pulldowns and rows. Keep elbows tucked close to the torso to maximize lat leverage.',
    exercises: ['lat_pulldown', 'supinated_pulldown', 'chest_supported_row', 'db_row']
  },
  {
    id: 'traps',
    name: 'Traps (Trapezius)',
    scientificName: 'Trapezius (Upper, Mid, Lower)',
    group: 'Back',
    description: 'A large diamond-shaped muscle running from the neck down to the mid-back.',
    origin: 'Occipital bone, ligamentum nuchae, and spinous processes of C7-T12',
    insertion: 'Lateral clavicle, acromion process, and spine of the scapula',
    action: 'Scapular elevation (shrugging), retraction (pulling shoulder blades back), and depression.',
    growDifficulty: 'Easy',
    recoveryTime: '48-72 hours',
    weeklySets: '8-14 sets',
    scientificNotes: 'Upper traps elevate, mid/lower traps retract. Row and face-pull variations cover all regions effectively.',
    exercises: ['chest_supported_row', 'cable_seated_row', 'seated_face_pull', 'deadlift']
  },
  {
    id: 'rhomboids',
    name: 'Rhomboids',
    scientificName: 'Rhomboid Major & Minor',
    group: 'Back',
    description: 'Deep muscles lying underneath the traps, connecting the shoulder blades to the spine.',
    origin: 'Spinous processes of C7-T5',
    insertion: 'Medial border of the scapula',
    action: 'Scapular retraction and elevation.',
    growDifficulty: 'Medium',
    recoveryTime: '48-72 hours',
    weeklySets: '8-12 sets',
    scientificNotes: 'Active in all horizontal rows. Squeeze the shoulder blades tightly at the end of rows to recruit them.',
    exercises: ['chest_supported_row', 'cable_seated_row', 'db_row']
  },
  {
    id: 'biceps',
    name: 'Biceps',
    scientificName: 'Biceps Brachii',
    group: 'Arms',
    description: 'Two-headed muscle on the front of the upper arm, consisting of the long head and short head.',
    origin: 'Coracoid process and supraglenoid tubercle of the scapula',
    insertion: 'Radial tuberosity and bicipital aponeurosis',
    action: 'Elbow flexion, forearm supination (turning palm up), and shoulder flexion (weak).',
    growDifficulty: 'Medium',
    recoveryTime: '48 hours',
    weeklySets: '8-14 sets',
    scientificNotes: 'Supination is a core function of the biceps. Turn your pinkies up hard at the peak of dumbbells curls.',
    exercises: ['db_supinated_curl', 'single_arm_cable_curl', 'hammer_curl']
  },
  {
    id: 'triceps',
    name: 'Triceps',
    scientificName: 'Triceps Brachii',
    group: 'Arms',
    description: 'Three-headed muscle on the back of the upper arm. Comprises 60% of the upper arm mass.',
    origin: 'Infraglenoid tubercle (long), posterior humerus (lateral & medial)',
    insertion: 'Olecranon process of the ulna',
    action: 'Elbow extension (straightening the arm). Long head also aids shoulder extension.',
    growDifficulty: 'Medium',
    recoveryTime: '48 hours',
    weeklySets: '8-14 sets',
    scientificNotes: 'Train with extensions (pushdowns, skull crushers). Overhead extensions load the long head under stretch.',
    exercises: ['db_skull_crusher', 'single_arm_rope_tricep_extension', 'assisted_dip', 'bench_press']
  },
  {
    id: 'forearms',
    name: 'Forearms',
    scientificName: 'Brachioradialis & Flexors/Extensors',
    group: 'Arms',
    description: 'Muscles of the lower arm responsible for grip strength, wrist movement, and elbow flexion.',
    origin: 'Humerus, radius, and ulna',
    insertion: 'Metacarpals and phalanges',
    action: 'Wrist flexion, wrist extension, forearm pronation, and elbow flexion (brachioradialis).',
    growDifficulty: 'Hard',
    recoveryTime: '48 hours',
    weeklySets: '6-10 sets (mostly secondary to heavy holds)',
    scientificNotes: 'Brachioradialis is best targeted with neutral grip curls (hammer curls). Flexors grow through heavy compound holds.',
    exercises: ['hammer_curl', 'deadlift']
  },
  {
    id: 'abs',
    name: 'Abs',
    scientificName: 'Rectus Abdominis',
    group: 'Core',
    description: 'The front abdominal wall muscle, creating the visual "6-pack".',
    origin: 'Pubic crest and pubic symphysis',
    insertion: 'Xiphoid process and costal cartilages of ribs 5-7',
    action: 'Spinal flexion (curling the torso forward) and pelvic tilt.',
    growDifficulty: 'Medium',
    recoveryTime: '48 hours',
    weeklySets: '6-12 sets',
    scientificNotes: 'Hypertrophy requires progressive overload just like other muscles. Do weighted crunches rather than endless reps.',
    exercises: ['crunch', 'plank', 'bicycle_crunch']
  },
  {
    id: 'obliques',
    name: 'Obliques',
    scientificName: 'Obliquus Internus & Externus',
    group: 'Core',
    description: 'Muscles on the side of the torso. They stabilize the spine and rotate the waist.',
    origin: 'External surfaces of ribs 5-12',
    insertion: 'Linea alba, pubic tubercle, and anterior half of iliac crest',
    action: 'Torso rotation and lateral flexion (bending sideways).',
    growDifficulty: 'Easy',
    recoveryTime: '48 hours',
    weeklySets: '4-8 sets',
    scientificNotes: 'Respond well to rotation templates. Avoid heavy loading if you wish to prevent widening of the waist.',
    exercises: ['bicycle_crunch']
  },
  {
    id: 'spinal_erectors',
    name: 'Spinal Erectors',
    scientificName: 'Erector Spinae',
    group: 'Core',
    description: 'A bundle of muscles running vertically along the spine, crucial for posture and back strength.',
    origin: 'Spinous processes of T9-L5, iliac crest, and sacrum',
    insertion: 'Spinous processes of T1-T8, ribs',
    action: 'Spine extension (straightening the back) and lateral flexion.',
    growDifficulty: 'Easy',
    recoveryTime: '72-96 hours',
    weeklySets: '6-10 sets',
    scientificNotes: 'Loads heavily during deadlifts and squats as stabilizers. Ensure neutral spine under heavy loads.',
    exercises: ['deadlift', 'back_squat', 'romanian_deadlift']
  },
  {
    id: 'glutes',
    name: 'Glutes (Gluteals)',
    scientificName: 'Gluteus Maximus, Medius & Minimus',
    group: 'Legs',
    description: 'The main buttocks muscle group, consisting of three muscles. The largest muscle group in the lower body.',
    origin: 'Ilium, sacrum, and coccyx',
    insertion: 'Gluteal tuberosity of femur and iliotibial tract (IT band)',
    action: 'Hip extension, abduction, and external rotation.',
    growDifficulty: 'Easy',
    recoveryTime: '48-72 hours',
    weeklySets: '10-18 sets',
    scientificNotes: 'Highly active in squats, lunges, deadlifts. Barbell hip thrusts provide peak contraction under high tension.',
    exercises: ['barbell_hip_thrust', 'back_squat', 'db_walking_lunge', 'deadlift', 'machine_seated_hip_abduction']
  },
  {
    id: 'quads',
    name: 'Quads (Quadriceps)',
    scientificName: 'Quadriceps Femoris',
    group: 'Legs',
    description: 'Four-headed muscle group on the front of the thigh. Extends the knee joint.',
    origin: 'Femur and ilium of pelvis',
    insertion: 'Tibial tuberosity via patellar tendon',
    action: 'Knee extension (straightening the leg). Rectus femoris also flexes the hip.',
    growDifficulty: 'Easy',
    recoveryTime: '48-72 hours',
    weeklySets: '12-20 sets',
    scientificNotes: 'Target using squats, leg presses, and leg extensions. Squats build the overall mass, extensions isolate.',
    exercises: ['back_squat', 'db_walking_lunge', 'leg_extension', 'single_leg_leg_extension']
  },
  {
    id: 'hamstrings',
    name: 'Hamstrings',
    scientificName: 'Biceps Femoris, Semitendinosus & Semimembranosus',
    group: 'Legs',
    description: 'A three-muscle complex on the back of the thigh. Crosses both hip and knee joints.',
    origin: 'Ischial tuberosity (hip bone) and linea aspera of femur',
    insertion: 'Tibia and fibula of the lower leg',
    action: 'Knee flexion (bending leg) and hip extension.',
    growDifficulty: 'Medium',
    recoveryTime: '48-72 hours',
    weeklySets: '10-16 sets',
    scientificNotes: 'Train both functions: Romanian deadlifts for hip extension, leg curls for knee flexion.',
    exercises: ['romanian_deadlift', 'lying_leg_curl', 'single_leg_lying_leg_curl', 'deadlift']
  },
  {
    id: 'calves',
    name: 'Calves',
    scientificName: 'Gastrocnemius & Soleus',
    group: 'Legs',
    description: 'Lower leg muscles consisting of the outer gastrocnemius and deep soleus.',
    origin: 'Femur condyles (gastrocnemius) and fibula/tibia (soleus)',
    insertion: 'Calcaneus (heel bone) via Achilles tendon',
    action: 'Plantarflexion (pointing toes downward).',
    growDifficulty: 'Hard',
    recoveryTime: '48 hours',
    weeklySets: '8-14 sets',
    scientificNotes: 'Gastrocnemius is active when knee is straight (standing raise). Soleus takes over when knee is bent.',
    exercises: ['standing_calf_raise']
  },
  {
    id: 'hip_flexors',
    name: 'Hip Flexors',
    scientificName: 'Iliopsoas',
    group: 'Legs',
    description: 'A deep muscle group connecting the spine to the femur, bringing the thighs toward the torso.',
    origin: 'Iliac fossa, sacrum, and T12-L5 vertebrae',
    insertion: 'Lesser trochanter of the femur',
    action: 'Hip flexion.',
    growDifficulty: 'Easy',
    recoveryTime: '48 hours',
    weeklySets: '4-8 sets (mostly passive/isometric)',
    scientificNotes: 'Highly active in leg raises. Keep them stretched to avoid anterior pelvic tilt.',
    exercises: ['bicycle_crunch']
  },
  {
    id: 'neck',
    name: 'Neck',
    scientificName: 'Sternocleidomastoideus & Splenius',
    group: 'Neck',
    description: 'Muscles supporting the head, posture, and cervical spine.',
    origin: 'Mastoid process, clavicle, and sternum',
    insertion: 'Cervical vertebrae and occipital bone',
    action: 'Neck flexion, extension, and rotation.',
    growDifficulty: 'Medium',
    recoveryTime: '48 hours',
    weeklySets: '2-4 sets (optional)',
    scientificNotes: 'Trained indirectly during heavy shrugs, face pulls, and deadlifts. Direct loading should be light.',
    exercises: ['seated_face_pull']
  }
];

// 2. Exercises Database
export const exercises: Exercise[] = [
  {
    id: 'back_squat',
    name: 'Back Squat',
    primaryMuscle: 'quads',
    secondaryMuscles: ['glutes', 'spinal_erectors', 'hamstrings'],
    activationPrimary: 90,
    activationSecondary: 60,
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    execution: [
      'Set the barbell on your traps/upper back. Stand with feet shoulder-width apart, toes flared 15 degrees.',
      'Brace your core, sit back and down as if sitting in a chair.',
      'Descend until your thighs are parallel to the floor or lower, keeping your chest up.',
      'Drive through the mid-foot to return to the starting position.'
    ],
    mistakes: [
      'Knees caving inward (valgus collapse).',
      'Lower back rounding at the bottom (butt wink).',
      'Heels lifting off the ground.'
    ],
    tempo: '3-1-1-0 (3s eccentric lowering, 1s pause, 1s concentric push)',
    rom: 'Deep squat, past parallel if mobility allows, to load quads in full stretch.',
    rpe: 8,
    rest: '3-4 mins',
    science: 'The squat loads the quadriceps in their deep lengthened position, which has been shown to produce superior muscle hypertrophy compared to partial reps.',
    alternatives: ['Leg Press', 'Goblet Squat', 'Smith Machine Squat'],
    youtubeUrl: 'https://www.youtube.com/watch?v=dW5-C1fsMjk'
  },
  {
    id: 'bench_press',
    name: 'Barbell Bench Press',
    primaryMuscle: 'chest',
    secondaryMuscles: ['front_delts', 'triceps'],
    activationPrimary: 95,
    activationSecondary: 40,
    equipment: 'Barbell',
    difficulty: 'Beginner',
    execution: [
      'Lie flat on the bench, pull your shoulder blades back and down (retraction/depression).',
      'Grip the bar slightly wider than shoulder-width. Plant your feet firmly on the floor.',
      'Unrack the bar and lower it under control to your mid-chest (nipple line).',
      'Press the bar up and slightly back toward your face to lock out.'
    ],
    mistakes: [
      'Flaring elbows out to 90 degrees (increases shoulder impingement risk).',
      'Bouncing the bar off the chest.',
      'Lifting your hips/butt off the bench.'
    ],
    tempo: '3-0-1-0',
    rom: 'Full range, touching chest at bottom to lock out at top.',
    rpe: 7,
    rest: '3-4 mins',
    science: 'Flat pressing activates the sternal head of the pectoralis major. Keeping the scapulae retracted isolates the chest and reduces front delt shear force.',
    alternatives: ['Dumbbell Bench Press', 'Hammer Strength Machine Press', 'Weighted Dips'],
    youtubeUrl: 'https://www.youtube.com/watch?v=esQi683XR44'
  },
  {
    id: 'deadlift',
    name: 'Conventional Barbell Deadlift',
    primaryMuscle: 'spinal_erectors',
    secondaryMuscles: ['hamstrings', 'glutes', 'traps', 'forearms'],
    activationPrimary: 85,
    activationSecondary: 70,
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    execution: [
      'Position your mid-foot under the barbell. Stand with feet hip-width apart.',
      'Bend over and grip the bar. Keep your back completely flat, hips relatively high.',
      'Pull your chest tall to brace your spine and pull the "slack" out of the bar.',
      'Drive your feet into the floor to lift the bar, keeping it close to your shins, locking out hips and knees together.'
    ],
    mistakes: [
      'Rounding the lower back (increases spinal shear stress).',
      'Squatting the weight up (hips too low, shins pushing bar forward).',
      'Hyper-extending the lower back at lockout.'
    ],
    tempo: '2-1-1-0',
    rom: 'Pull from ground to full lockout. Control the lowering phase.',
    rpe: 8,
    rest: '3-4 mins',
    science: 'The deadlift is a massive compound lift recruiting the entire posterior chain, including traps and spinal erectors, under heavy isometric and concentric loads.',
    alternatives: ['Sumo Deadlift', 'Barbell Hip Thrust', 'Trap Bar Deadlift'],
    youtubeUrl: 'https://www.youtube.com/watch?v=fc4_hq7tjkU'
  },
  {
    id: 'romanian_deadlift',
    name: 'Romanian Deadlift (RDL)',
    primaryMuscle: 'hamstrings',
    secondaryMuscles: ['glutes', 'spinal_erectors'],
    activationPrimary: 90,
    activationSecondary: 55,
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    execution: [
      'Stand holding the barbell at your hips. Keep your feet hip-width apart and a slight bend in your knees.',
      'Push your hips straight back, hinging at the waist. Keep your spine perfectly neutral.',
      'Lower the bar down your thighs/shins until you feel a deep stretch in your hamstrings.',
      'Drive your hips forward to return to standing, squeezing your glutes.'
    ],
    mistakes: [
      'Letting the bar drift away from the body.',
      'Rounding the upper or lower spine.',
      'Bending the knees too much (turns it into a squat).'
    ],
    tempo: '3-1-1-0',
    rom: 'From hips down to mid-shin (or as far as hamstrings stretch allows without spine rounding).',
    rpe: 7,
    rest: '2-3 mins',
    science: 'RDLs focus on hip extension which targets the biceps femoris long head, semitendinosus, and semimembranosus under a intense eccentric stretch.',
    alternatives: ['Glute Ham Raise', 'Dumbbell RDL', 'Cable Pull-Through'],
    youtubeUrl: 'https://www.youtube.com/watch?v=SE-2Y-3a1pY'
  },
  {
    id: 'lat_pulldown',
    name: 'Wide-Grip Lat Pulldown',
    primaryMuscle: 'lats',
    secondaryMuscles: ['traps', 'biceps', 'rhomboids'],
    activationPrimary: 90,
    activationSecondary: 45,
    equipment: 'Cable',
    difficulty: 'Beginner',
    execution: [
      'Sit at the machine, adjusting the thigh guards. Grip the bar at 1.5x shoulder width.',
      'Lean back slightly (10-15 degrees). Pull your elbows down and back.',
      'Lower the bar to your upper collarbone, squeezing your shoulder blades together.',
      'Return the bar slowly to the top, allowing the lats to fully stretch.'
    ],
    mistakes: [
      'Using excessive momentum/swinging the torso.',
      'Pulling the bar behind the neck.',
      'Failing to control the eccentric return.'
    ],
    tempo: '3-0-1-1',
    rom: 'Full extension at the top (arm straight) to touching upper chest.',
    rpe: 8,
    rest: '2-3 mins',
    science: 'Wide grip pulldowns maximize shoulder adduction, loading the latissimus dorsi fibers. Avoid momentum to ensure active muscle tension.',
    alternatives: ['Weighted Pullups', 'Assisted Chin-ups', 'Single-Arm Pulldown'],
    youtubeUrl: 'https://www.youtube.com/watch?v=apzFTbsm7HU'
  },
  {
    id: 'military_press',
    name: 'Barbell Military Press',
    primaryMuscle: 'front_delts',
    secondaryMuscles: ['side_delts', 'triceps', 'traps'],
    activationPrimary: 88,
    activationSecondary: 40,
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    execution: [
      'Rack a barbell at chest height. Hold it with hands just outside shoulder width.',
      'Unrack, squeeze your glutes and quads to lock your torso solid.',
      'Tuck your chin back. Press the bar straight up overhead, clearing your face.',
      'Once the bar clears your head, push your head forward slightly and lock out.'
    ],
    mistakes: [
      'Leaning back excessively (shifts load to upper chest and strains lumbar spine).',
      'Flaring elbows out laterally (keep them tucked at 45 degrees in front).',
      'Using leg drive (turns it into a push press).'
    ],
    tempo: '3-0-1-0',
    rom: 'From collarbone to full overhead lock out.',
    rpe: 8,
    rest: '3-4 mins',
    science: 'Standing overhead press recruits the anterior deltoid heavily as a primary mover. The core and glutes act isometrically to transfer forces.',
    alternatives: ['Dumbbell Seated Shoulder Press', 'Standing Dumbbell Press', 'Machine Shoulder Press'],
    youtubeUrl: 'https://www.youtube.com/watch?v=CnBmiBqp-AI'
  },
  {
    id: 'db_lateral_raise',
    name: 'Dumbbell Lateral Raise',
    primaryMuscle: 'side_delts',
    secondaryMuscles: ['front_delts', 'traps'],
    activationPrimary: 92,
    activationSecondary: 30,
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    execution: [
      'Stand holding dumbbells at your sides, torso tilted forward very slightly (5 degrees).',
      'Lead with your elbows. Raise your arms out to the sides, tilting dumbbells so your pinkies are slightly up.',
      'Stop when your arms are parallel to the floor.',
      'Lower under control back to your thighs.'
    ],
    mistakes: [
      'Shrugging with the traps to lift the weights.',
      'Swinging the body to create momentum.',
      'Raising arms too far above shoulder height.'
    ],
    tempo: '2-0-1-1',
    rom: 'From sides of thighs up to shoulder level (90 degrees).',
    rpe: 8,
    rest: '1-2 mins',
    science: 'Lateral raises isolate the lateral deltoid. A slight forward tilt keeps the lateral delt in the scapular plane, reducing shoulder joint irritation.',
    alternatives: ['Cable Lateral Raise', 'Machine Lateral Raise', 'Leaning Cable Raise'],
    youtubeUrl: 'https://www.youtube.com/watch?v=6m7JO28RqZg'
  },
  {
    id: 'lying_leg_curl',
    name: 'Lying Leg Curl',
    primaryMuscle: 'hamstrings',
    secondaryMuscles: ['calves'],
    activationPrimary: 95,
    activationSecondary: 25,
    equipment: 'Machine',
    difficulty: 'Beginner',
    execution: [
      'Lie face down on the leg curl bench. Place the roller pad just below your calf muscles.',
      'Grip the handles, keep your hips flat against the bench.',
      'Curl the weight up toward your glutes, squeezing your hamstrings.',
      'Lower the weight back to starting position under control.'
    ],
    mistakes: [
      'Arching your lower back and lifting hips off the pad.',
      'Performing reps too quickly without squeeze.',
      'Failing to fully extend the legs.'
    ],
    tempo: '3-0-1-1',
    rom: 'Full extension to peak flexion near the glutes.',
    rpe: 8,
    rest: '1-2 mins',
    science: 'Lying leg curls isolate hamstring knee flexion. Keeping hips flat prevents recruitment of the lower back and glutes, isolating the hamstrings.',
    alternatives: ['Seated Leg Curl', 'Dumbbell Leg Curl', 'Nordic Hamstring Curl'],
    youtubeUrl: 'https://www.youtube.com/watch?v=1Tq3QdYUuHs'
  },
  {
    id: 'barbell_hip_thrust',
    name: 'Barbell Hip Thrust',
    primaryMuscle: 'glutes',
    secondaryMuscles: ['hamstrings', 'quads'],
    activationPrimary: 98,
    activationSecondary: 30,
    equipment: 'Barbell',
    difficulty: 'Beginner',
    execution: [
      'Sit on the floor, upper back braced against a bench. Roll a padded barbell over your hips.',
      'Plant your feet flat on the floor, shoulder-width apart. Keep your chin tucked.',
      'Drive through your heels to extend your hips, lifting the barbell.',
      'Keep your rib cage down and spine neutral. Squeeze your glutes hard at the top, then lower.'
    ],
    mistakes: [
      'Arching the lower back instead of hinging the hips.',
      'Failing to achieve full hip extension at the top.',
      'Looking up at the ceiling (tuck chin to maintain posterior pelvic tilt).'
    ],
    tempo: '2-1-1-1',
    rom: 'Hips from floor to fully locked out parallel to the floor.',
    rpe: 8,
    rest: '2-3 mins',
    science: 'Unlike squats, the hip thrust places peak mechanical tension on the glutes at short muscle lengths (full contraction/lockout), causing massive glute activation.',
    alternatives: ['Single-Leg DB Hip Thrust', 'Smith Machine Hip Thrust', 'Cable Pull-Through'],
    youtubeUrl: 'https://www.youtube.com/watch?v=RjWiwq1wgFg&t=2s'
  },
  {
    id: 'seated_face_pull',
    name: 'Cable Seated Face Pull',
    primaryMuscle: 'rear_delts',
    secondaryMuscles: ['traps', 'rhomboids', 'neck'],
    activationPrimary: 85,
    activationSecondary: 50,
    equipment: 'Cable',
    difficulty: 'Beginner',
    execution: [
      'Attach a rope to a cable pulley at upper chest/face height.',
      'Stand or sit, hold rope with thumbs pointing back. Pull the rope straight toward your nose.',
      'As you pull, flare your hands apart to externally rotate the shoulders (make a double-bicep pose).',
      'Hold the contraction, then slowly return.'
    ],
    mistakes: [
      'Pulling too low (should be pulled to nose/eyes).',
      'Using too much weight and jerking the torso.',
      'Lacking shoulder external rotation (hands should be further back than elbows).'
    ],
    tempo: '2-0-1-1',
    rom: 'Arms fully straight to rope flared past ears.',
    rpe: 8,
    rest: '1-2 mins',
    science: 'Face pulls hit the rear delts, mid traps, and rotator cuff muscles. Combining pulling with external rotation maximizes rear delt and shoulder health.',
    alternatives: ['Dumbbell Rear Delt Fly', 'Cable Reverse Fly', 'Chest Supported Row to Neck'],
    youtubeUrl: 'https://www.youtube.com/watch?v=HSoHeSjvIdY'
  },
  {
    id: 'db_incline_press',
    name: 'Dumbbell Incline Press',
    primaryMuscle: 'upper_chest',
    secondaryMuscles: ['front_delts', 'triceps'],
    activationPrimary: 90,
    activationSecondary: 40,
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    execution: [
      'Set an incline bench to 30-45 degrees. Lie back holding dumbbells at chest height.',
      'Keep your shoulder blades retracted and feet flat on the floor.',
      'Press dumbbells up and inward in a slight arc, bringing them together over your face.',
      'Lower under control until they touch the outer chest.'
    ],
    mistakes: [
      'Bench angle too high (above 45 degrees shifts load to shoulder front delts).',
      'Banging dumbbells at the top.',
      'Flaring elbows outward.'
    ],
    tempo: '3-0-1-0',
    rom: 'Deep stretch at bottom to full lockout at top.',
    rpe: 7,
    rest: '2-3 mins',
    science: 'The clavicular fibers (upper chest) run upward. Pressing at an incline aligns the path of motion directly with these fibers for superior growth.',
    alternatives: ['Incline Barbell Press', 'Incline Hammer Strength Press', 'Low-to-High Cable Flye'],
    youtubeUrl: 'https://www.youtube.com/watch?v=ggJycLjz01E'
  },
  {
    id: 'db_walking_lunge',
    name: 'Dumbbell Walking Lunge',
    primaryMuscle: 'quads',
    secondaryMuscles: ['glutes', 'hamstrings'],
    activationPrimary: 85,
    activationSecondary: 50,
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    execution: [
      'Hold dumbbells in each hand. Take a medium stride forward.',
      'Lower your hips until your back knee is just above the floor, and front thigh is parallel.',
      'Lean your torso forward slightly (10-15 degrees) to shift loading.',
      'Push off with the back leg, stepping forward into the next lunge step.'
    ],
    mistakes: [
      'Stepping in a straight line (imbalances, step slightly outward like on train tracks).',
      'Failing to descend to full depth.',
      'Letting the front knee collapse inward.'
    ],
    tempo: '2-0-1-0',
    rom: 'Alternating steps, full depth on each rep.',
    rpe: 8,
    rest: '2-3 mins',
    science: 'Lunges load the quadriceps and glutes unilaterally. The split stance requires high stability from the gluteus medius and core stabilizers.',
    alternatives: ['Reverse Lunge', 'Bulgarian Split Squat', 'Goblet Lunge'],
    youtubeUrl: 'https://www.youtube.com/watch?v=vni4lElTvsY'
  },
  {
    id: 'db_supinated_curl',
    name: 'Dumbbell Supinated Curl',
    primaryMuscle: 'biceps',
    secondaryMuscles: ['forearms'],
    activationPrimary: 95,
    activationSecondary: 20,
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    execution: [
      'Stand holding dumbbells with a neutral grip (palms facing inside).',
      'Curl dumbbells up. As you cross 90 degrees, rotate your wrist so palms face up (supination).',
      'Drive your pinky fingers outward at the top peak contraction.',
      'Lower slowly, rotating back to neutral at the bottom.'
    ],
    mistakes: [
      'Swinging elbows forward (uses front delts to lift weight).',
      'Failing to supinate (palms remain in neutral hammer pose).',
      'Using torso swing.'
    ],
    tempo: '3-0-1-1',
    rom: 'Full extension at bottom to maximum elbow bend at top.',
    rpe: 8,
    rest: '1-2 mins',
    science: 'The biceps brachii functions as both an elbow flexor and a wrist supinator. Supinating under load activates both the short and long heads optimally.',
    alternatives: ['Barbell Curl', 'Preacher Curl', 'Cable Curl'],
    youtubeUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo'
  },
  {
    id: 'db_skull_crusher',
    name: 'Dumbbell Skull Crusher',
    primaryMuscle: 'triceps',
    secondaryMuscles: [],
    activationPrimary: 95,
    activationSecondary: 0,
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    execution: [
      'Lie flat on a bench, holding dumbbells directly over your shoulders.',
      'Incline your upper arms back slightly (15 degrees) to keep tension on triceps.',
      'Hinge at the elbows, lowering the dumbbells toward the sides of your forehead.',
      'Extend the elbows back to the start, maintaining the slight upper arm backward angle.'
    ],
    mistakes: [
      'Moving the elbows forward and back (recruits lats and front delts).',
      'Baring elbows out sideways (keep elbows tucked in line).',
      'Failing to control the descent.'
    ],
    tempo: '3-0-1-0',
    rom: 'Full elbow flexion (deep stretch) to lock out.',
    rpe: 8,
    rest: '1-2 mins',
    science: 'Inclinng the upper arms back slightly keeps tension on the triceps long head even at lockout. Dumbbells allow a neutral grip which reduces elbow joint strain.',
    alternatives: ['EZ Bar Skull Crusher', 'Overhead Cable Extension', 'Tricep Pressdown'],
    youtubeUrl: 'https://www.youtube.com/watch?v=ZUZOn9c1VVI'
  },
  {
    id: 'chest_supported_row',
    name: 'Chest-Supported T-Bar Row',
    primaryMuscle: 'traps',
    secondaryMuscles: ['lats', 'rhomboids', 'biceps'],
    activationPrimary: 85,
    activationSecondary: 55,
    equipment: 'Machine',
    difficulty: 'Beginner',
    execution: [
      'Lie chest-down on the pad. Grip handles with desired hand placement (pronated or neutral).',
      'Protracted your shoulder blades fully at the bottom to stretch the back.',
      'Row the handles up, retracting your scapulae tightly at peak contraction.',
      'Lower slowly to full stretch, keeping chest firmly on pad.'
    ],
    mistakes: [
      'Lifting your chest off the support pad (strains lower back).',
      'Pulling with wrist/forearms instead of elbows.',
      'Short-ranging the extension at the bottom.'
    ],
    tempo: '3-0-1-1',
    rom: 'Full protraction at bottom to complete retraction at top.',
    rpe: 8,
    rest: '2-3 mins',
    science: 'Supporting the chest eliminates lower back stabilization requirements. This allows maximum loading of the mid-back (traps, rhomboids, and lats) safely to failure.',
    alternatives: ['Dumbbell Chest Supported Row', 'Barbell Row', 'Cable Seated Row'],
    youtubeUrl: 'https://www.youtube.com/watch?v=w0KnlQ-b7jw'
  }
];

// 3. Workout Splits Templates
export const splits: WorkoutSplit[] = [
  {
    id: 'full_body',
    name: 'Full Body (3 Days/Week)',
    description: 'Perfect for beginners and busy lifters. Stimulates muscles frequently with high efficiency.',
    schedule: 'Monday: Full Body #1, Wednesday: Full Body #2, Friday: Full Body #3 (Rest on other days)',
    days: {
      weeks_1_4: [
        {
          name: 'Full Body #1',
          focus: 'Squat & Bench Strength Base',
          exercises: [
            { exerciseId: 'back_squat', sets: 3, reps: '6', rpe: 7, rest: '3-4 mins', notes: 'Sit back and down, 15 degree toe flare, drive knees out.' },
            { exerciseId: 'bench_press', sets: 3, reps: '8', rpe: 7, rest: '3-4 mins', notes: 'Tuck elbows at 45 deg, squeeze shoulder blades, stay firm.' },
            { exerciseId: 'lat_pulldown', sets: 3, reps: '10', rpe: 8, rest: '2-3 mins', notes: 'Pull elbows to sides, 1.5x shoulder width grip.' },
            { exerciseId: 'romanian_deadlift', sets: 3, reps: '10', rpe: 7, rest: '2-3 mins', notes: 'Neutral back, hinge at hips, stretch hamstrings.' },
            { exerciseId: 'assisted_dip', sets: 3, reps: '8', rpe: 7, rest: '1-2 mins', notes: 'Lean forward 15 degrees, tuck elbows.' },
            { exerciseId: 'standing_calf_raise', sets: 3, reps: '10', rpe: 8, rest: '1-2 mins', notes: 'Press to toes, stretch at bottom, don\'t bounce.' },
            { exerciseId: 'db_supinated_curl', sets: 3, reps: '10', rpe: 8, rest: '1-2 mins', notes: 'Drive pinky outward at top contraction.' }
          ]
        },
        {
          name: 'Full Body #2',
          focus: 'Deadlift & Press Strength Base',
          exercises: [
            { exerciseId: 'deadlift', sets: 3, reps: '5', rpe: 7, rest: '3-4 mins', notes: 'Brace lats, chest tall, hips high, pull slack out.' },
            { exerciseId: 'military_press', sets: 3, reps: '8', rpe: 8, rest: '3-4 mins', notes: 'Squeeze glutes to lock spine, press overhead.' },
            { exerciseId: 'chest_supported_row', sets: 3, reps: '12', rpe: 8, rest: '2-3 mins', notes: 'Retract scapulae at top, protract at bottom.' },
            { exerciseId: 'leg_extension', sets: 3, reps: '12', rpe: 8, rest: '1-2 mins', notes: 'Squeeze quads hard at the top lockout.' },
            { exerciseId: 'cable_flye', sets: 3, reps: '12', rpe: 8, rest: '1-2 mins', notes: 'Keep scapulae retracted, squeeze inner elbows.' },
            { exerciseId: 'crunch', sets: 3, reps: '12', rpe: 7, rest: '1-2 mins', notes: 'Flex spine, don\'t pull on your neck.' },
            { exerciseId: 'db_skull_crusher', sets: 3, reps: '12', rpe: 8, rest: '1-2 mins', notes: 'Keep upper arm angled slightly back.' }
          ]
        },
        {
          name: 'Full Body #3',
          focus: 'Hypertrophy & Posterior Chain',
          exercises: [
            { exerciseId: 'db_walking_lunge', sets: 3, reps: '10 steps/leg', rpe: 8, rest: '2-3 mins', notes: 'Medium strides, lean forward slightly.' },
            { exerciseId: 'db_incline_press', sets: 3, reps: '8', rpe: 7, rest: '2-3 mins', notes: 'Angled bench (30 deg), stretch upper chest.' },
            { exerciseId: 'lat_pulldown', sets: 3, reps: '10 (Reverse Grip)', rpe: 8, rest: '2-3 mins', notes: 'Underhand shoulder-width grip, elbows down.' },
            { exerciseId: 'barbell_hip_thrust', sets: 3, reps: '12', rpe: 8, rest: '2-3 mins', notes: 'Tuck chin, squeeze glutes hard at lockout.' },
            { exerciseId: 'seated_face_pull', sets: 3, reps: '12', rpe: 8, rest: '1-2 mins', notes: 'Pull rope to nose, flare hands out.' },
            { exerciseId: 'db_lateral_raise', sets: 3, reps: '10', rpe: 8, rest: '1-2 mins', notes: 'Raise to sides, control eccentric.' },
            { exerciseId: 'lying_leg_curl', sets: 3, reps: '10', rpe: 8, rest: '1-2 mins', notes: 'Isolate hamstrings, keep hips flat.' }
          ]
        }
      ],
      weeks_5_8: [
        {
          name: 'Full Body #1',
          focus: 'Hypertrophy & Isolation Loading',
          exercises: [
            { exerciseId: 'back_squat', sets: 3, reps: '8', rpe: 8, rest: '3-4 mins', notes: 'Sit back and down, drive knees out.' },
            { exerciseId: 'db_lateral_raise', sets: 3, reps: '12', rpe: 9, rest: '1-2 mins', notes: 'Focus on lateral delt, lean slightly away.' },
            { exerciseId: 'lat_pulldown', sets: 3, reps: '12 (Single-Arm)', rpe: 9, rest: '2-3 mins', notes: 'Match reps with non-dominant arm.' },
            { exerciseId: 'barbell_hip_thrust', sets: 3, reps: '8', rpe: 9, rest: '2-3 mins', notes: 'Squeeze glutes hard at the top lockout.' },
            { exerciseId: 'cable_flye', sets: 3, reps: '15 (Pec Deck)', rpe: 9, rest: '1-2 mins', notes: 'Keep chest high, squeeze inner elbows.' },
            { exerciseId: 'seated_face_pull', sets: 3, reps: '15 (Rear Delt Flye)', rpe: 9, rest: '1-2 mins', notes: 'Protract shoulders at bottom, fly out.' }
          ]
        },
        {
          name: 'Full Body #2',
          focus: 'Posterior chain & Core Focus',
          exercises: [
            { exerciseId: 'deadlift', sets: 3, reps: '3', rpe: 8, rest: '3-4 mins', notes: 'Brace lats, pull slack out, flat back.' },
            { exerciseId: 'bench_press', sets: 3, reps: '5 (Close-Grip)', rpe: 7, rest: '3-4 mins', notes: 'Shoulder width grip, tuck elbows close.' },
            { exerciseId: 'chest_supported_row', sets: 3, reps: '12 (DB Row)', rpe: 8, rest: '2-3 mins', notes: 'Brace on bench, row elbow against side.' },
            { exerciseId: 'db_walking_lunge', sets: 3, reps: '12 steps/leg', rpe: 8, rest: '1-2 mins', notes: 'Control pace, moderate stride.' },
            { exerciseId: 'assisted_dip', sets: 3, reps: '12', rpe: 8, rest: '1-2 mins', notes: 'Control depth, contract triceps.' },
            { exerciseId: 'bicycle_crunch', sets: 3, reps: '10', rpe: 7, rest: '1-2 mins', notes: 'Flex and rotate torso slowly.' }
          ]
        },
        {
          name: 'Full Body #3',
          focus: 'Strength Base & Upper Drive',
          exercises: [
            { exerciseId: 'back_squat', sets: 3, reps: '5', rpe: 8, rest: '2-3 mins', notes: 'Solid brace, squeeze upper back.' },
            { exerciseId: 'bench_press', sets: 3, reps: '10', rpe: 8, rest: '2-3 mins', notes: 'Control descent, push dynamically.' },
            { exerciseId: 'lat_pulldown', sets: 3, reps: '15 (Neutral Grip)', rpe: 8, rest: '2-3 mins', notes: 'Palms facing inside, row elbows low.' },
            { exerciseId: 'lying_leg_curl', sets: 3, reps: '12', rpe: 8, rest: '2-3 mins', notes: 'Keep hips down, squeeze hamstrings.' },
            { exerciseId: 'seated_face_pull', sets: 3, reps: '15', rpe: 8, rest: '1-2 mins', notes: 'Pull rope high to forehead.' },
            { exerciseId: 'db_skull_crusher', sets: 3, reps: '12 (Single-Arm Cable)', rpe: 8, rest: '1-2 mins', notes: 'Face away from cable, pull arm high.' }
          ]
        }
      ]
    }
  },
  {
    id: 'upper_lower',
    name: 'Upper / Lower (4 Days/Week)',
    description: 'Jeff Nippard\'s recommended program. Ideal balance between fatigue management and localized frequency.',
    schedule: 'Monday: Lower 1, Tuesday: Upper 1, Thursday: Lower 2, Friday: Upper 2',
    days: {
      weeks_1_4: [
        {
          name: 'Lower Body #1',
          focus: 'Squat & Posterior Chain',
          exercises: [
            { exerciseId: 'back_squat', sets: 3, reps: '6', rpe: 7, rest: '3-4 mins', notes: 'Sit back, flare toes, drive knees out.' },
            { exerciseId: 'romanian_deadlift', sets: 3, reps: '10', rpe: 7, rest: '2-3 mins', notes: 'Hinge back, feel hamstring stretch.' },
            { exerciseId: 'barbell_hip_thrust', sets: 3, reps: '12', rpe: 8, rest: '2-3 mins', notes: 'Tuck chin, drive through heels.' },
            { exerciseId: 'lying_leg_curl', sets: 3, reps: '12', rpe: 9, rest: '1-2 mins', notes: 'Hips down, squeeze curls.' },
            { exerciseId: 'crunch', sets: 3, reps: '12', rpe: 7, rest: '1-2 mins', notes: 'Flex spine, control contraction.' }
          ]
        },
        {
          name: 'Upper Body #1',
          focus: 'Bench Press & Pull Power',
          exercises: [
            { exerciseId: 'bench_press', sets: 3, reps: '5', rpe: 7, rest: '3-4 mins', notes: 'Tuck elbows 45 degrees, arch upper back.' },
            { exerciseId: 'lat_pulldown', sets: 3, reps: '10', rpe: 8, rest: '2-3 mins', notes: 'Pull to collarbone, flare chest high.' },
            { exerciseId: 'military_press', sets: 3, reps: '10', rpe: 7, rest: '3-4 mins', notes: 'Core braced, press straight overhead.' },
            { exerciseId: 'chest_supported_row', sets: 3, reps: '12', rpe: 8, rest: '2-3 mins', notes: 'Squeeze shoulder blades.' },
            { exerciseId: 'cable_flye', sets: 3, reps: '12', rpe: 8, rest: '1-2 mins', notes: 'Squeeze inner elbows, retract shoulders.' },
            { exerciseId: 'db_supinated_curl', sets: 3, reps: '10', rpe: 8, rest: '1-2 mins', notes: 'Supinate wrist under curl.' }
          ]
        },
        {
          name: 'Lower Body #2',
          focus: 'Deadlift & Single Leg',
          exercises: [
            { exerciseId: 'deadlift', sets: 3, reps: '8', rpe: 7, rest: '3-4 mins', notes: 'Keep bar against shins, lock out dynamically.' },
            { exerciseId: 'db_walking_lunge', sets: 3, reps: '10 steps/leg', rpe: 8, rest: '2-3 mins', notes: 'Torso lean forward, moderate stride.' },
            { exerciseId: 'lying_leg_curl', sets: 3, reps: '15 (Single Leg)', rpe: 8, rest: '1-2 mins', notes: 'Isolate each side.' },
            { exerciseId: 'standing_calf_raise', sets: 3, reps: '12', rpe: 8, rest: '1-2 mins', notes: 'Stretch at bottom, hold peaks.' },
            { exerciseId: 'plank', sets: 3, reps: '20s hold', rpe: 8, rest: '1-2 mins', notes: 'Squeeze glutes and abs.' }
          ]
        },
        {
          name: 'Upper Body #2',
          focus: 'Incline Press & Row Depth',
          exercises: [
            { exerciseId: 'db_incline_press', sets: 3, reps: '8', rpe: 8, rest: '2-3 mins', notes: 'Angled bench, stretch upper chest.' },
            { exerciseId: 'lat_pulldown', sets: 3, reps: '8 (Reverse Grip)', rpe: 8, rest: '2-3 mins', notes: 'Underhand grip pulldown.' },
            { exerciseId: 'assisted_dip', sets: 3, reps: '10', rpe: 7, rest: '2-3 mins', notes: 'Lean chest forward, tuck elbows.' },
            { exerciseId: 'db_lateral_raise', sets: 3, reps: '15', rpe: 8, rest: '1-2 mins', notes: 'Raise out to sides, control eccentric.' },
            { exerciseId: 'seated_face_pull', sets: 3, reps: '15', rpe: 8, rest: '1-2 mins', notes: 'Pull rope back, thumbs out.' }
          ]
        }
      ],
      weeks_5_8: [
        {
          name: 'Lower Body #1',
          focus: 'Deadlift & Leg Press Strength',
          exercises: [
            { exerciseId: 'deadlift', sets: 3, reps: '5', rpe: 8, rest: '3-4 mins', notes: 'Keep lats engaged, drive off ground.' },
            { exerciseId: 'lying_leg_curl', sets: 3, reps: '15', rpe: 9, rest: '1-2 mins', notes: 'Keep hips flat, focus on curl.' }
          ]
        },
        {
          name: 'Upper Body #1',
          focus: 'Hypertrophy Compound Vol',
          exercises: [
            { exerciseId: 'bench_press', sets: 3, reps: '8', rpe: 8, rest: '3-4 mins', notes: 'Concentrate on chest contraction.' },
            { exerciseId: 'assisted_dip', sets: 3, reps: '6', rpe: 8, rest: '1-2 mins', notes: 'Slow negatives, push hard.' }
          ]
        },
        {
          name: 'Lower Body #2',
          focus: 'Squats & Thrust Power',
          exercises: [
            { exerciseId: 'back_squat', sets: 3, reps: '8', rpe: 8, rest: '3-4 mins', notes: 'Moderate speed, parallel depth.' },
            { exerciseId: 'barbell_hip_thrust', sets: 3, reps: '8', rpe: 8, rest: '2-3 mins', notes: 'Control hip drive.' },
            { exerciseId: 'romanian_deadlift', sets: 3, reps: '12', rpe: 8, rest: '2-3 mins', notes: 'Keep spine straight.' },
            { exerciseId: 'standing_calf_raise', sets: 3, reps: '6', rpe: 9, rest: '1-2 mins', notes: 'Heavier raises, control stretch.' }
          ]
        },
        {
          name: 'Upper Body #2',
          focus: 'Overhead Pressing & Width',
          exercises: [
            { exerciseId: 'military_press', sets: 3, reps: '6', rpe: 8, rest: '3-4 mins', notes: 'Barbell press overhead.' },
            { exerciseId: 'db_incline_press', sets: 3, reps: '8', rpe: 8, rest: '2-3 mins', notes: 'Upper chest isolator.' },
            { exerciseId: 'db_lateral_raise', sets: 3, reps: '12 (Cable Raise)', rpe: 8, rest: '1-2 mins', notes: 'Lean and raise cable.' }
          ]
        }
      ]
    }
  }
];

// 4. Learning Center Lessons
export const lessons: Lesson[] = [
  {
    id: 'hypertrophy_basics',
    title: 'Science of Hypertrophy',
    duration: '5 min read',
    category: 'Science',
    content: [
      'Muscle hypertrophy occurs when muscle fibers sustain damage or high tension, prompting the body to repair and enlarge them.',
      'There are three primary mechanisms of muscle growth:',
      '1. Mechanical Tension: The primary driver. Created by lifting heavy weights through a full range of motion.',
      '2. Muscle Damage: Micro-tears in the muscle fibers caused by heavy eccentric loading (e.g. lowering phase).',
      '3. Metabolic Stress: The "pump" sensation. Caused by metabolite accumulation (lactate, hydrogen ions) in high-rep training.',
      'For maximum growth, prioritize mechanical tension by focusing on progressive overload and heavy compound movements.'
    ],
    illustrationText: 'Graph showing Muscle Protein Synthesis (MPS) vs Muscle Protein Breakdown (MPB). Growth happens when MPS exceeds MPB.'
  },
  {
    id: 'progressive_overload',
    title: 'Progressive Overload Guide',
    duration: '4 min read',
    category: 'Programming',
    content: [
      'Progressive overload is the gradual increase of stress placed upon the body during training over time.',
      'If you lift the same weights for the same reps year after year, your muscles have no stimulus to grow.',
      'How to apply progressive overload:',
      '- Load: Add weight to the bar (e.g. lift 105 lbs instead of 100 lbs).',
      '- Reps: Perform more reps with the same weight (e.g. lift 10 reps instead of 8).',
      '- Sets: Increase volume by adding another working set.',
      '- Form: Improve lift execution control and reduce momentum.',
      'Aim to beat your previous workout performance by at least 1 rep or 2.5 lbs on key exercises.'
    ],
    illustrationText: 'Timeline curve showing incremental weight and reps increase leading to muscle fiber hypertrophy adaptions.'
  },
  {
    id: 'understanding_rpe',
    title: 'RPE & Reps in Reserve (RIR)',
    duration: '5 min read',
    category: 'Programming',
    content: [
      'RPE stands for Rate of Perceived Exertion. In lifting, it is based on Reps in Reserve (RIR).',
      'RIR measures how many more repetitions you could have performed before reaching absolute failure.',
      '- RPE 10 (0 RIR): Absolute failure. You could not do another rep.',
      '- RPE 9 (1 RIR): Extremely hard. You had exactly 1 rep left in the tank.',
      '- RPE 8 (2 RIR): Heavy. You had exactly 2 reps left in the tank.',
      '- RPE 7 (3 RIR): Solid challenge. You had 3 reps left.',
      'Hypertrophy science shows that sets must be taken within 1 to 4 reps of failure (RPE 7-9) to stimulate muscle growth effectively.'
    ],
    illustrationText: 'Thermometer scale showing RPE from 1 to 10. The "Hypertrophy Zone" is highlighted between RPE 7 and 9.5.'
  },
  {
    id: 'rom_tempo',
    title: 'Range of Motion & Tempo',
    duration: '4 min read',
    category: 'Anatomy',
    content: [
      'Range of Motion (ROM) is the distance a joint moves during a lift. Full ROM recruits more muscle fibers and stretches the muscle under load.',
      'Lifting a muscle in its fully stretched state (lengthened hypertrophy) creates a much stronger growth stimulus than locking out at short lengths.',
      'Lifting Tempo is written as a 4-digit code (e.g. 3-0-1-0):',
      '- 1st Digit (3): Eccentric phase duration (lowering the weight for 3 seconds).',
      '- 2nd Digit (0): Pause at the bottom/stretch position.',
      '- 3rd Digit (1): Concentric phase duration (exploding up in 1 second).',
      '- 4th Digit (0): Pause at the top/contracted position.',
      'Always control the eccentric phase (2-3 seconds) to maximize muscle damage and mechanical tension.'
    ],
    illustrationText: 'Bicep curl representation showing the eccentric phase (extension/stretch) and concentric phase (contraction/flexion).'
  }
];

// 5. Scientific FAQ Items
export const faqs: FAQItem[] = [
  {
    id: 'faq1',
    question: 'How do I know if I am progressing?',
    answer: 'Bodybuilding is a marathon. Direct visual progress is hard to detect day-to-day. Take physique photos every 4-6 weeks for side-by-side comparison. Because of the direct relationship between strength and muscle, tracking your strength is your best proxy. If you are getting stronger in optimal hypertrophy rep ranges, you are building muscle.'
  },
  {
    id: 'faq2',
    question: 'How much muscle can I expect to gain?',
    answer: 'For natural untrained males, 1-2 lbs of muscle per month is reasonable in your first year. Intermediates with 1-2 years experience slow down to 0.5-1 lb per month. Advanced lifters build muscle much slower. Women can divide these ballparks in half.'
  },
  {
    id: 'faq3',
    question: 'Should I use a weight belt?',
    answer: 'Lifting belts are optional. They are highly beneficial for squats, deadlifts, and military presses because they increase intra-abdominal pressure to stabilize the spine. Do not use them on light warm-up sets, and maintain identical brace patterns with or without.'
  },
  {
    id: 'faq4',
    question: 'I am not getting sore. Is the program working?',
    answer: 'Delayed Onset Muscle Soreness (DOMS) is not required for muscle hypertrophy. Soreness is mostly caused by novel movements, eccentric emphasis, and long muscle stretches. As your body adapts to the program, soreness will decrease, which is a sign of improved recovery capability, not a lack of growth stimulus.'
  },
  {
    id: 'faq5',
    question: 'How do I eat (deficit vs surplus) during this program?',
    answer: 'Eating in a slight caloric surplus (200-300 calories over maintenance) provides the best environment for muscle recovery and strength gain. If fat loss is your priority, eat in a moderate caloric deficit (300-500 calories under maintenance) with high protein (0.8-1g per lb of bodyweight) to achieve body recomposition (lose fat and build muscle simultaneously).'
  },
  {
    id: 'faq6',
    question: 'Why is there so little exercise variation week-to-week?',
    answer: 'Constantly swapping exercises from week to week hinders your ability to progressively overload. By keeping exercises constant for 8 weeks, you master the form and can easily measure strength gains. Varied training is built into the 8-week block graduations, not weekly switches.'
  }
];

// 6. Warm-Up Checklist Items
export const warmups: WarmupItem[] = [
  {
    id: 'w1',
    name: 'Low Intensity Cardio',
    sets: 'N/A',
    repsTime: '5-10 mins',
    notes: 'Pick any cardio machine (treadmill, bike, row). Raise heart rate to 100-135 BPM to increase core body temperature.'
  },
  {
    id: 'w2',
    name: 'Foam Rolling / Lacrosse Ball',
    sets: 'N/A',
    repsTime: '2-3 mins',
    notes: 'Roll large muscles (quads, lats, calves). Use lacrosse ball for tight, small areas (chest, shoulders).'
  },
  {
    id: 'w3',
    name: 'Front/Back Leg Swing',
    sets: '2',
    repsTime: '12 reps / leg',
    notes: 'Swing leg forward and back to activate hip flexors and glutes dynamically.'
  },
  {
    id: 'w4',
    name: 'Standing Glute Squeeze',
    sets: '2',
    repsTime: '15 sec hold',
    notes: 'Stand tall, squeeze your glutes as hard as possible to establish mind-muscle connection.'
  },
  {
    id: 'w5',
    name: 'Prone Trap Raise',
    sets: '2',
    repsTime: '15 reps',
    notes: 'Lie face down, raise arms in a Y shape, squeezing the mid and lower traps.'
  },
  {
    id: 'w6',
    name: 'Cable External Rotation',
    sets: '2',
    repsTime: '15 reps / arm',
    notes: 'Rotate arm outwards against light resistance to warm up the rotator cuff.'
  }
];
