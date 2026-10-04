/**
 * CodeDuo - Questions Repository
 * Supports 3 Question Types:
 * 1. 'reorder': Drag & drop / click-to-order code snippets
 * 2. 'bug_fix': Multiple choice find the syntax bug
 * 3. 'terminal': Terminal fill-in-the-blank prompt
 */

const QUESTION_DATA = {
  // JavaScript Track
  javascript: {
    1: [ // Stage 1: Hello World
      {
        id: 'js-1-1',
        type: 'reorder',
        title: 'Construct Mainframe Boot Sequence',
        instruction: 'Arrange the code snippets in the correct order to declare and run the boot function.',
        mascotTip: 'Functions must be declared with their body before being invoked!',
        blocks: [
          { id: 'b1', code: 'function bootSystem() {' },
          { id: 'b2', code: '  console.log("CYBER_CORE_ONLINE");' },
          { id: 'b3', code: '}' },
          { id: 'b4', code: 'bootSystem();' }
        ],
        solution: ['b1', 'b2', 'b3', 'b4']
      },
      {
        id: 'js-1-2',
        type: 'bug_fix',
        title: 'Locate Mainframe Print Bug',
        instruction: 'Find the bug in this cyber terminal print statement:',
        mascotTip: 'Look closely at the console method spelling!',
        codeSnippet: `const hacker = "NeoCoder";\nconsol.log("Access Granted, " + hacker);`,
        errorLine: 2,
        options: [
          { id: 'opt1', text: 'Typo: "consol.log" should be "console.log"', correct: true, explanation: 'The global object in JavaScript is spelled "console", with an "e".' },
          { id: 'opt2', text: 'The variable "hacker" must be declared with let instead of const', correct: false, explanation: 'const is completely valid for variables that do not get reassigned.' },
          { id: 'opt3', text: 'Strings cannot be concatenated with the + operator', correct: false, explanation: 'The + operator is valid for concatenating strings in JavaScript.' },
          { id: 'opt4', text: 'Missing semicolon after "NeoCoder"', correct: false, explanation: 'Line 1 already has a proper semicolon.' }
        ]
      },
      {
        id: 'js-1-3',
        type: 'terminal',
        title: 'Terminal Input Injection',
        instruction: 'Type the missing global object method name to print the data stream:',
        mascotTip: 'What method on console outputs messages to the developer terminal?',
        terminalCommand: 'node runner.js',
        prefix: 'console.',
        suffix: '("SYSTEM INTEGRITY 100%");',
        placeholder: 'log',
        validAnswers: ['log'],
        explanation: 'console.log() is the standard method to output messages to the console in JavaScript.'
      }
    ],

    2: [ // Stage 2: Variables & Types
      {
        id: 'js-2-1',
        type: 'bug_fix',
        title: 'Memory Overwrite Exception',
        instruction: 'Why does this code throw an unhandled TypeError?',
        mascotTip: 'Constants cannot have their values reallocated!',
        codeSnippet: `const batteryLevel = 100;\nbatteryLevel = 85;\nconsole.log(batteryLevel);`,
        errorLine: 2,
        options: [
          { id: 'opt1', text: 'Reassigning a const variable (Assignment to constant variable)', correct: true, explanation: 'Variables declared with "const" are read-only and cannot be reassigned.' },
          { id: 'opt2', text: 'Variable names cannot use camelCase', correct: false, explanation: 'camelCase like batteryLevel is standard naming convention in JS.' },
          { id: 'opt3', text: 'batteryLevel cannot store numeric values', correct: false, explanation: 'JavaScript variables can store any valid numeric value.' },
          { id: 'opt4', text: 'console.log cannot accept variables directly', correct: false, explanation: 'console.log happily prints variables of any type.' }
        ]
      },
      {
        id: 'js-2-2',
        type: 'reorder',
        title: 'Calculate Cyber Shield Integrity',
        instruction: 'Assemble the statements to initialize stats and log total shield power.',
        mascotTip: 'Declare your values first before calculating the sum!',
        blocks: [
          { id: 'b1', code: 'let baseShield = 75;' },
          { id: 'b2', code: 'let booster = 25;' },
          { id: 'b3', code: 'let totalShield = baseShield + booster;' },
          { id: 'b4', code: 'console.log("Shield: " + totalShield);' }
        ],
        solution: ['b1', 'b2', 'b3', 'b4']
      },
      {
        id: 'js-2-3',
        type: 'terminal',
        title: 'Declare Reassignable Variable',
        instruction: 'Fill in the modern JavaScript keyword used to declare a variable that CAN be reassigned:',
        mascotTip: 'It has 3 letters and replaced old "var" in modern ES6!',
        terminalCommand: 'cat memory_alloc.js',
        prefix: '',
        suffix: ' cyberCredits = 500;',
        placeholder: 'keyword',
        validAnswers: ['let', 'var'],
        explanation: '"let" allows you to declare block-scoped variables that can be updated later.'
      }
    ],

    3: [ // Stage 3: IF/ELSE Logic
      {
        id: 'js-3-1',
        type: 'bug_fix',
        title: 'Firewall Gate Vulnerability',
        instruction: 'Find the dangerous logic flaw in this security checkpoint:',
        mascotTip: 'Are we comparing or assigning?',
        codeSnippet: `let securityTier = 1;\nif (securityTier = 5) {\n  grantAdminAccess();\n}`,
        errorLine: 2,
        options: [
          { id: 'opt1', text: 'Single "=" is assignment, not comparison! It evaluates to truthy.', correct: true, explanation: 'Using = overwrites securityTier to 5 and always passes the check. Use === to compare!' },
          { id: 'opt2', text: 'Parentheses around if conditions are prohibited in JS', correct: false, explanation: 'Parentheses (condition) are mandatory in JavaScript if statements.' },
          { id: 'opt3', text: 'grantAdminAccess() requires parameters', correct: false, explanation: 'Functions without parameters can be called with empty parentheses.' },
          { id: 'opt4', text: 'securityTier cannot be checked in conditional blocks', correct: false, explanation: 'Any variable can be checked in a condition.' }
        ]
      },
      {
        id: 'js-3-2',
        type: 'reorder',
        title: 'Construct Defensive Protocol',
        instruction: 'Assemble the complete if/else decision block for emergency thrusters.',
        mascotTip: 'Remember the proper order of if, opening braces, else, and closing braces.',
        blocks: [
          { id: 'b1', code: 'if (batteryPower > 20) {' },
          { id: 'b2', code: '  activateHyperDrive();' },
          { id: 'b3', code: '} else {' },
          { id: 'b4', code: '  conservePower();' },
          { id: 'b5', code: '}' }
        ],
        solution: ['b1', 'b2', 'b3', 'b4', 'b5']
      },
      {
        id: 'js-3-3',
        type: 'terminal',
        title: 'Logical AND Gate Operator',
        instruction: 'Type the operator that checks if BOTH conditions must be true:',
        mascotTip: 'Two consecutive ampersands!',
        terminalCommand: 'node auth_gate.js',
        prefix: 'if (hasBiometrics ',
        suffix: ' hasAccessCard) { unlockVault(); }',
        placeholder: 'operator',
        validAnswers: ['&&'],
        explanation: '&& is the logical AND operator in JavaScript, returning true only if both operands are true.'
      }
    ],

    4: [ // Stage 4: Loop Boss Battle (The Glitch King)
      {
        id: 'js-4-1',
        type: 'reorder',
        title: 'PHASE 1: Launch Multi-Beam Strike',
        instruction: 'Build a for-loop that executes 3 concentrated laser strikes on the Glitch King!',
        mascotTip: 'Initialize index at 0, test condition i < 3, and increment with i++!',
        blocks: [
          { id: 'b1', code: 'for (let i = 0; i < 3; i++) {' },
          { id: 'b2', code: '  chargePlasmaCannon();' },
          { id: 'b3', code: '  fireLaserStrike(35);' },
          { id: 'b4', code: '}' }
        ],
        solution: ['b1', 'b2', 'b3', 'b4'],
        bossDamage: 35
      },
      {
        id: 'js-4-2',
        type: 'bug_fix',
        title: 'PHASE 2: Halt the Infinite Loop Virus',
        instruction: 'The Glitch King is locking your CPU in an infinite loop! What line is missing?',
        mascotTip: 'What causes a while-loop condition to eventually become false?',
        codeSnippet: `let virusCount = 0;\nwhile (virusCount < 5) {\n  console.log("MALWARE SPREADING!");\n  // BUG: Missing counter increment!\n}`,
        errorLine: 4,
        options: [
          { id: 'opt1', text: 'Missing "virusCount++" to increment counter, causing an infinite loop', correct: true, explanation: 'Without incrementing virusCount, virusCount < 5 remains true forever, freezing the browser!' },
          { id: 'opt2', text: 'while-loops only support boolean literals', correct: false, explanation: 'while-loops accept any condition that evaluates to boolean.' },
          { id: 'opt3', text: 'virusCount must be a string', correct: false, explanation: 'Loops typically iterate over numbers.' },
          { id: 'opt4', text: 'Missing break statement after while', correct: false, explanation: 'A loop naturally terminates when its condition turns false.' }
        ],
        bossDamage: 35
      },
      {
        id: 'js-4-3',
        type: 'terminal',
        title: 'PHASE 3: Final Decimation Loop',
        instruction: 'Complete the loop update to deplete boss HP by 10 on each tick until defeated:',
        mascotTip: 'Subtract 10 using the subtraction assignment operator!',
        terminalCommand: 'sh ./boss_purge.sh',
        prefix: 'for (let bossHp = 30; bossHp > 0; bossHp ',
        suffix: ' 10) { strike(); }',
        placeholder: '-=',
        validAnswers: ['-=', '-= '],
        explanation: 'bossHp -= 10 subtracts 10 from bossHp on each iteration until it reaches 0.',
        bossDamage: 35
      }
    ],

    5: [ // Stage 5: Functions & Callbacks
      {
        id: 'js-5-1',
        type: 'reorder',
        title: 'Assemble Cyber Encryption Subroutine',
        instruction: 'Reorder this function that takes a plaintext string and returns encrypted hex:',
        mascotTip: 'Declare function parameters, process string, and return the result.',
        blocks: [
          { id: 'b1', code: 'function encryptData(rawKey) {' },
          { id: 'b2', code: '  let hash = "CYBER#" + rawKey;' },
          { id: 'b3', code: '  return hash.toUpperCase();' },
          { id: 'b4', code: '}' }
        ],
        solution: ['b1', 'b2', 'b3', 'b4']
      },
      {
        id: 'js-5-2',
        type: 'bug_fix',
        title: 'The Ghost Return Value',
        instruction: 'Why does calling calculateDamage(50, 10) return undefined?',
        mascotTip: 'Did we give back a value to the caller?',
        codeSnippet: `function calculateDamage(base, crit) {\n  let total = base * crit;\n  // What is missing here?\n}\nlet dmg = calculateDamage(50, 10);`,
        errorLine: 3,
        options: [
          { id: 'opt1', text: 'Missing the "return total;" statement', correct: true, explanation: 'In JavaScript, functions without an explicit return statement implicitly return undefined.' },
          { id: 'opt2', text: 'Parameters base and crit must be declared with let', correct: false, explanation: 'Function parameters are declared in the argument list, not with let.' },
          { id: 'opt3', text: 'total cannot multiply two numbers', correct: false, explanation: 'Multiplication with * is completely valid.' },
          { id: 'opt4', text: 'The function name cannot contain uppercase letters', correct: false, explanation: 'CamelCase function names are standard.' }
        ]
      },
      {
        id: 'js-5-3',
        type: 'terminal',
        title: 'Modern Arrow Function Syntax',
        instruction: 'Type the arrow token that connects parameters to the function body:',
        mascotTip: 'Equal sign followed by greater-than sign!',
        terminalCommand: 'node lambda.js',
        prefix: 'const pingServer = (ip) ',
        suffix: ' console.log("Pinging: " + ip);',
        placeholder: '=>',
        validAnswers: ['=>'],
        explanation: '=> is the arrow operator used in ES6 Arrow Functions.'
      }
    ],

    6: [ // Stage 6: Cyber Arrays
      {
        id: 'js-6-1',
        type: 'reorder',
        title: 'Populate Cyberdeck Equipment Array',
        instruction: 'Arrange the statements to initialize an array, push an upgrade, and check count:',
        mascotTip: 'Initialize array, call .push(), and read .length property.',
        blocks: [
          { id: 'b1', code: 'const cyberDeck = ["EMP_Grenade", "ICE_Breaker"];' },
          { id: 'b2', code: 'cyberDeck.push("Neural_Whip");' },
          { id: 'b3', code: 'let itemTotal = cyberDeck.length;' },
          { id: 'b4', code: 'console.log("Slots: " + itemTotal);' }
        ],
        solution: ['b1', 'b2', 'b3', 'b4']
      },
      {
        id: 'js-6-2',
        type: 'bug_fix',
        title: 'Zero-Based Index Trap',
        instruction: 'You want the first item from the array. What is the bug?',
        mascotTip: 'In computer science, array indexing starts from what number?',
        codeSnippet: `const weapons = ["LaserGun", "PlasmaBlade", "Rocket"];\nlet firstWeapon = weapons[1];\nconsole.log(firstWeapon); // Prints PlasmaBlade!`,
        errorLine: 2,
        options: [
          { id: 'opt1', text: 'Arrays are 0-indexed! weapons[0] is the first item.', correct: true, explanation: 'In JavaScript and most languages, indices begin at 0. weapons[1] retrieves the second item.' },
          { id: 'opt2', text: 'Arrays cannot use square bracket notation', correct: false, explanation: 'Square brackets [index] are the standard array index syntax.' },
          { id: 'opt3', text: 'weapons array is read-only', correct: false, explanation: 'Array elements can be read without issue.' },
          { id: 'opt4', text: 'Strings in arrays must be numbers', correct: false, explanation: 'Arrays can hold elements of any data type.' }
        ]
      },
      {
        id: 'js-6-3',
        type: 'terminal',
        title: 'Append Array Item Method',
        instruction: 'Type the built-in array method name used to append an item to the end of an array:',
        mascotTip: 'The opposite of pop!',
        terminalCommand: 'node inventory.js',
        prefix: 'inventory.',
        suffix: '("CyberNanoPatch");',
        placeholder: 'push',
        validAnswers: ['push'],
        explanation: 'array.push(item) adds one or more elements to the end of an array.'
      }
    ]
  },

  // Python Track
  python: {
    1: [
      {
        id: 'py-1-1',
        type: 'reorder',
        title: 'Define Python Boot Routine',
        instruction: 'Order the lines to define a function that outputs a cyber warning in Python.',
        mascotTip: 'Use def to declare functions in Python, followed by a colon!',
        blocks: [
          { id: 'b1', code: 'def boot_cyber_core():' },
          { id: 'b2', code: '    print("MAINFRAME_ONLINE")' },
          { id: 'b3', code: 'boot_cyber_core()' }
        ],
        solution: ['b1', 'b2', 'b3']
      },
      {
        id: 'py-1-2',
        type: 'bug_fix',
        title: 'Python Syntax Error on Print',
        instruction: 'Find the Python 3 syntax error in this print statement:',
        mascotTip: 'Python 3 requires parentheses around print arguments!',
        codeSnippet: `user = "NetRunner"\nprint "Welcome back, " + user`,
        errorLine: 2,
        options: [
          { id: 'opt1', text: 'Missing parentheses: print() is a function in Python 3', correct: true, explanation: 'In Python 3, print is a built-in function and requires parentheses: print(...).' },
          { id: 'opt2', text: 'user variable must have let keyword', correct: false, explanation: 'Python does not use variable declaration keywords like let or const.' },
          { id: 'opt3', text: 'Missing semicolon at end of line', correct: false, explanation: 'Semicolons are not required in Python.' }
        ]
      },
      {
        id: 'py-1-3',
        type: 'terminal',
        title: 'Python Output Built-in',
        instruction: 'Type Python\'s built-in function to display text on the terminal screen:',
        mascotTip: '5 letters, rhymes with mint!',
        terminalCommand: 'python3 hello.py',
        prefix: '',
        suffix: '("ACCESS GRANTED")',
        placeholder: 'print',
        validAnswers: ['print'],
        explanation: 'print() is Python\'s built-in standard output function.'
      }
    ],
    2: [
      {
        id: 'py-2-1',
        type: 'bug_fix',
        title: 'Type Incompatibility Error',
        instruction: 'Why does this code throw a TypeError in Python?',
        mascotTip: 'Can Python implicitly concatenate integers with strings?',
        codeSnippet: `level = 10\nmessage = "Cyber Level: " + level\nprint(message)`,
        errorLine: 2,
        options: [
          { id: 'opt1', text: 'Cannot concatenate str and int directly! Must use str(level)', correct: true, explanation: 'Python is strongly typed and will not implicitly convert integers to strings during concatenation.' },
          { id: 'opt2', text: 'Variable message must use double equals', correct: false, explanation: 'Double equals == is for comparison, single = is for assignment.' },
          { id: 'opt3', text: 'level variable cannot hold integers', correct: false, explanation: 'level = 10 is perfectly valid.' }
        ]
      },
      {
        id: 'py-2-2',
        type: 'reorder',
        title: 'Python Variable Allocation',
        instruction: 'Reorder statements to calculate total battery power in Python:',
        mascotTip: 'Assign values before performing mathematical operations.',
        blocks: [
          { id: 'b1', code: 'cell_a = 50' },
          { id: 'b2', code: 'cell_b = 30' },
          { id: 'b3', code: 'total = cell_a + cell_b' },
          { id: 'b4', code: 'print(f"Total: {total}")' }
        ],
        solution: ['b1', 'b2', 'b3', 'b4']
      },
      {
        id: 'py-2-3',
        type: 'terminal',
        title: 'Convert String to Integer',
        instruction: 'Type the built-in Python function used to parse a numeric string into an integer:',
        mascotTip: '3 letters!',
        terminalCommand: 'python3 parse.py',
        prefix: 'energy = ',
        suffix: '("100")',
        placeholder: 'int',
        validAnswers: ['int'],
        explanation: 'int() converts a valid numeric string or float into an integer.'
      }
    ],
    3: [
      {
        id: 'py-3-1',
        type: 'bug_fix',
        title: 'Missing Python Indentation / Colon',
        instruction: 'Why does Python fail to compile this conditional statement?',
        mascotTip: 'What punctuation must end an if statement in Python?',
        codeSnippet: `energy = 5\nif energy > 0\n    print("System active")`,
        errorLine: 2,
        options: [
          { id: 'opt1', text: 'Missing colon ":" at the end of the if statement', correct: true, explanation: 'In Python, control flow statements like if, for, while, def must end with a colon (:).' },
          { id: 'opt2', text: 'Missing curly braces around print', correct: false, explanation: 'Python uses indentation rather than curly braces for code blocks.' },
          { id: 'opt3', text: 'Missing parentheses around energy > 0', correct: false, explanation: 'Parentheses around if conditions are optional in Python.' }
        ]
      },
      {
        id: 'py-3-2',
        type: 'reorder',
        title: 'Build Python If-Else Block',
        instruction: 'Arrange the indented lines to form a clean Python branch:',
        mascotTip: 'Header line ends with colon, body is indented, else ends with colon.',
        blocks: [
          { id: 'b1', code: 'if shield_up:' },
          { id: 'b2', code: '    deflect_damage()' },
          { id: 'b3', code: 'else:' },
          { id: 'b4', code: '    take_damage(20)' }
        ],
        solution: ['b1', 'b2', 'b3', 'b4']
      },
      {
        id: 'py-3-3',
        type: 'terminal',
        title: 'Logical AND Keyword in Python',
        instruction: 'Type Python\'s logical conjunction word (unlike JS, Python uses plain English!):',
        mascotTip: '3 letters word!',
        terminalCommand: 'python3 auth.py',
        prefix: 'if is_authorized ',
        suffix: ' has_token: grant_access()',
        placeholder: 'and',
        validAnswers: ['and'],
        explanation: 'In Python, "and" is the logical operator used to combine conditional statements.'
      }
    ],
    4: [ // Stage 4: Python Boss Battle
      {
        id: 'py-4-1',
        type: 'reorder',
        title: 'BOSS RAID: Python Range Strike',
        instruction: 'Construct a for loop using range(3) to unleash 3 laser blasts at the Glitch King!',
        mascotTip: 'for i in range(3): followed by indented commands.',
        blocks: [
          { id: 'b1', code: 'for i in range(3):' },
          { id: 'b2', code: '    charge_laser()' },
          { id: 'b3', code: '    fire_shot(35)' }
        ],
        solution: ['b1', 'b2', 'b3'],
        bossDamage: 35
      },
      {
        id: 'py-4-2',
        type: 'bug_fix',
        title: 'Defuse Python Infinite While Loop',
        instruction: 'Find the bug in this Python defense loop:',
        mascotTip: 'How do you increment a number in Python?',
        codeSnippet: `count = 0\nwhile count < 3:\n    print("Defending...")\n    count++ # Syntax error in Python!`,
        errorLine: 4,
        options: [
          { id: 'opt1', text: 'Python does not have "++" operator! Must use "count += 1"', correct: true, explanation: 'Python does not support ++ or -- operators. You must use count += 1 or count = count + 1.' },
          { id: 'opt2', text: 'while condition must be wrapped in parentheses', correct: false, explanation: 'Parentheses are optional in Python while loops.' },
          { id: 'opt3', text: 'count variable cannot be modified in while loops', correct: false, explanation: 'Variables can be updated freely inside loops.' }
        ],
        bossDamage: 35
      },
      {
        id: 'py-4-3',
        type: 'terminal',
        title: 'Terminate Loop Instantly',
        instruction: 'Type the Python keyword that immediately exits/escapes a loop:',
        mascotTip: '5 letters, like breaking a firewall!',
        terminalCommand: 'python3 kill_boss.py',
        prefix: 'if boss_hp <= 0: ',
        suffix: '; # Exit loop immediately',
        placeholder: 'break',
        validAnswers: ['break'],
        explanation: '"break" terminates the current loop immediately when executed.',
        bossDamage: 35
      }
    ],
    5: [
      {
        id: 'py-5-1',
        type: 'reorder',
        title: 'Define Subroutine with Return',
        instruction: 'Reorder to define a Python function returning formatted hacker credentials:',
        mascotTip: 'def name(arg): -> body -> return result.',
        blocks: [
          { id: 'b1', code: 'def generate_badge(user_id):' },
          { id: 'b2', code: '    tag = f"HACKER_{user_id}"' },
          { id: 'b3', code: '    return tag.upper()' }
        ],
        solution: ['b1', 'b2', 'b3']
      },
      {
        id: 'py-5-2',
        type: 'bug_fix',
        title: 'Missing Keyword in Function Definition',
        instruction: 'What keyword is missing to define a Python function?',
        mascotTip: 'How do you declare a function in Python?',
        codeSnippet: `function decrypt_signal(cipher):\n    return cipher[::-1]`,
        errorLine: 1,
        options: [
          { id: 'opt1', text: 'Python uses "def", not "function"', correct: true, explanation: 'In Python, functions are declared with the "def" keyword.' },
          { id: 'opt2', text: 'Slicing [::-1] is illegal in Python', correct: false, explanation: 'Slicing with step -1 is Python\'s idiomatic way to reverse sequences.' },
          { id: 'opt3', text: 'Missing return type declaration', correct: false, explanation: 'Return type hints are optional in Python.' }
        ]
      },
      {
        id: 'py-5-3',
        type: 'terminal',
        title: 'Anonymous Lambda Function',
        instruction: 'Type the Python keyword used to define small anonymous single-line functions:',
        mascotTip: '6 letters, starts with l!',
        terminalCommand: 'python3 lambda_test.py',
        prefix: 'double_val = ',
        suffix: ' x: x * 2',
        placeholder: 'lambda',
        validAnswers: ['lambda'],
        explanation: '"lambda" creates anonymous inline functions in Python.'
      }
    ],
    6: [
      {
        id: 'py-6-1',
        type: 'reorder',
        title: 'Python List Manipulation',
        instruction: 'Reorder statements to manage a list of cyber tools in Python:',
        mascotTip: 'Define list, append item, print count with len().',
        blocks: [
          { id: 'b1', code: 'tools = ["Scanner", "Probe"]' },
          { id: 'b2', code: 'tools.append("Decrypter")' },
          { id: 'b3', code: 'print(f"Total tools: {len(tools)}")' }
        ],
        solution: ['b1', 'b2', 'b3']
      },
      {
        id: 'py-6-2',
        type: 'bug_fix',
        title: 'Python List Method Confusion',
        instruction: 'Why does tools.push("Key") fail with AttributeError?',
        mascotTip: 'What method does Python lists use instead of push?',
        codeSnippet: `tools = ["Wrench"]\ntools.push("Laser") # AttributeError: 'list' object has no attribute 'push'`,
        errorLine: 2,
        options: [
          { id: 'opt1', text: 'Python lists use .append(), not .push()', correct: true, explanation: 'JavaScript arrays use push(), whereas Python lists use append().' },
          { id: 'opt2', text: 'tools list cannot be modified', correct: false, explanation: 'Python lists are mutable.' },
          { id: 'opt3', text: 'Strings must be single-quoted in lists', correct: false, explanation: 'Single and double quotes are interchangeable in Python.' }
        ]
      },
      {
        id: 'py-6-3',
        type: 'terminal',
        title: 'Get List Length Function',
        instruction: 'Type the built-in Python function used to count elements in a list or string:',
        mascotTip: '3 letters, short for length!',
        terminalCommand: 'python3 list_test.py',
        prefix: 'count = ',
        suffix: '(["Chip", "Wire", "Battery"])',
        placeholder: 'len',
        validAnswers: ['len'],
        explanation: 'len() returns the number of items in a list or sequence in Python.'
      }
    ]
  }
};

window.QUESTION_DATA = QUESTION_DATA;
