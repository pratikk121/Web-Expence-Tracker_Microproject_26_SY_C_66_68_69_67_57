A MicroProject Report

on

Web Expense Tracker - An Offline-First Progressive Web App

Submitted to Savitribai Phule Pune University, Pune, as a part of the academic course work requirements for the completion of

Second Year Bachelor of Technology

in

Information Technology

Submitted by

Jivitesh Revoo     Roll No: C69



Department of Information Technology

G H Raisoni College of Engineering and Management, Pune

Academic Year: 2025-26
Summer 2026



CERTIFICATE

This is to certify that the Microproject report entitled

Web Expense Tracker - An Offline-First Progressive Web App
Submitted by
Jivitesh Revoo   (C-69) 

are bonafide students of this institute and have carried out the course work of Javascript and PHP Microproject under the supervision of [Guide Name]. This report is approved for partial fulfillment of the requirement of the S.Y B.Tech. (Information Technology) for the academic year 2025–26.




[Guide Name]                                                                   Dr. Poonam Gupta
         Guide


Head of Department

[External Examiner Name]
     External Examiner


Dr. N. B. Hulle         I/C Director GHRCEM, Pune

 


Date:

Place: Pune







ACKNOWLEDGMENT


We would like to express our sincere thanks to Dr. Poonam Gupta, Head of Information Technology Department for continuous support & valuable suggestions. We would like to thank [Guide name], for their valuable support in providing us with the required information, guidance and light of knowledge, we could complete this Microproject.

We take this opportunity to thank all the staff members of the Department of Information Technology Engineering for their help whenever required. 

We take this opportunity to thank our Incharge Director, Dr. N. B. Hulle and Campus Director, Dr. R. D. Kharadkar, for his whole hearted support, motivation & valuable suggestions.

Finally, we would like to give special thanks to all staff members of the Department of Information Technology, G H Raisoni College of Engineering and Management, Pune & our friends for their kind support.

Jivitesh Revoo   (C-69) 






ABSTRACT

The Web Expense Tracker represents a comprehensive, secure, and modern financial management application engineered to revolutionize how users log, monitor, and analyze their daily expenditures. Traditional expense logging methods, characterized by physical ledgers, complex Excel spreadsheets, or online-only web applications, are often plagued by accessibility limitations, loss of data in poor network areas, and cumbersome data entry interfaces. In response to these critical challenges, this project leverages the ubiquitous LAMP stack (Linux, Apache, MySQL, PHP), combined with cutting-edge Progressive Web App (PWA) paradigms, to deliver a high-performance, offline-capable application that prioritizes both constant accessibility and advanced data organization.

At the architectural core of this platform is the transition from a standard web application to a Progressive Web App (PWA) utilizing Service Workers and persistent LocalStorage. This allows the application to gracefully handle network interruptions. The custom-engineered "Background Sync Queue" allows users to create, edit, and delete transactions completely offline. Once internet connectivity is restored, the application seamlessly pushes the queued operations to the central MySQL database, mathematically guaranteeing that the localized state remains synchronized with the master server ledger without requiring any manual intervention from the user.

To facilitate comprehensive financial management, the system integrates four major advanced logic features wrapped in a premium, monochromatic Glassmorphic UI. First, an automated Monthly Budget Tracker visually warns users of their spending against a custom limit dynamically. Second, an intelligent Receipt Image Compressor allows users to snap photos of physical receipts, compressing them on the client-side using HTML5 Canvas APIs into lightweight Base64 strings before securely storing them. Third, a native CSV Generation Engine actively parses array datasets to generate downloadable spreadsheet backups instantly entirely within the browser. Finally, a unique "Lazy Auto-Logger" handles Recurring Expenses (Weekly/Monthly/Yearly) by calculating due dates and processing unlogged automated expenses seamlessly in the background during standard API authentication handshakes.

Security and data integrity remain paramount throughout the application's lifecycle. The platform employs industry-standard mitigation strategies against common attack vectors. SQL Injection vulnerabilities are neutralized entirely through the absolute enforcement of PDO (PHP Data Objects) Prepared Statements. The sanctity of user credentials is protected via robust cryptographic hashing algorithms (BCrypt: PASSWORD_DEFAULT), ensuring zero-knowledge storage of sensitive user data. 

Ultimately, this microproject successfully bridges the gap between traditional PHP backend principles and modern, offline-first JavaScript application development. It serves as a demonstrable proof-of-concept that complex tasks like offline queueing, image processing, and recurring chronologies can be elegantly handled using native web technologies, solving real-world logistical challenges surrounding personal finance management.

Index

1 Introduction
2 Objective of the Project
3 Tools/Technologies Used
4 Project Design / Methodology
5 Implementation / Working
6 Results / Output
7 Conclusion
8 References



___________________________________

CHAPTER 1: INTRODUCTION

1.1 Detailed Overview of Expense Management Systems
In modern daily routines, managing personal finances effectively requires immense discipline. Tracking every purchase from small daily coffees to large yearly subscriptions involves significant manual effort. Traditional paper-based budgeting systems rely on physical ledgers or disjointed spreadsheets which often fail to provide accurate, real-time feedback regarding one's immediate financial standing. Additionally, many modern apps require persistent internet connections, rendering them entirely useless when a user needs to log a quick expense in low-connectivity areas such as subways, basements, or remote travel locations.

The Web Expense Tracker aims to digitalize and resolve these limitations through modern engineering. By offering an offline-first PWA, users can install the application directly to their mobile home screens and use it like a native app regardless of connectivity. By introducing visual budget warnings, automatic currency conversion, and receipt attachments, the system ensures that tracking finances becomes a fast, seamless habit rather than a tedious chore.

1.2 Motivation and Pedagogical Goals
The primary motivation behind engineering this platform was twofold. Conceptually, it was designed to solve a tangible problem faced by everyday users—the need for a fast, reliable, and secure environment to log and budget expenditures locally and globally. Technically and pedagogically, the motivation was to gain profound, practical experience with full-stack web development utilizing the LAMP architecture and combining it with modern offline JavaScript service paradigms. 

Developing a state-of-the-art PWA requires careful consideration of numerous computer science domains. It challenges the developer to manage application state across network statuses (online/offline), design intelligent local storage caching mechanisms, program client-side image compression algorithms to reduce server payload, and engineer database architectures capable of handling asynchronous, queued data dumps safely. It serves as a comprehensive proving ground for transitioning from theoretical programming concepts into production-ready software engineering.

1.3 Scope and Limitations
Scope:
- Service Worker & PWA Architecture: Fully installable application capabilities with offline-caching of assets (HTML/CSS/JS) ensuring the UI loads instantly without an active internet connection.
- Background Sync Queueing: The ability to intercept forms while internet access is unavailable, store the payload in a local queue array, and synchronize via HTTP POST/PUT/DELETE upon network restoration.
- Comprehensive Financial Control: Full CRUD management of finances with accompanying photo attachments mapped dynamically to specific categories.
- Algorithmic Budget & Recurring Systems: Logic permitting visual spending limit management alongside an automated chronology engine plotting weekly/monthly/yearly recurring charges securely.
- Push Notification Reminders: Native browser notification integration prompting users daily if they have failed to log their required transactions to build positive habits.

Limitations:
- Deployment Restraints: The system operates via local deployment environments (localhost/XAMPP) and shared free web hosting (InfinityFree). A full production launch requires a dedicated server infrastructure and dedicated SSL certificates to process native Apple/Android push notifications correctly.
- Open Banking Integrations: The current iteration replies on manual entry or auto-recurring logic. Direct Plaid or Open Banking API connections to securely scrape literal bank statements automatically via OAuth was deemed outside the boundaries of this microproject scope.



__________________________________


CHAPTER 2: PROJECT OBJECTIVES AND PROBLEM FORMULATION

2.1 Formal Problem Statement
Personal finance demands an ecosystem that can accurately record data off-grid, analyze limits efficiently, and synchronize across multiple devices without imposing heavy overhead on the user. Existing digital setups are frequently hindered by their absolute reliance on active server connections. Moreover, while simple budget apps exist, they fundamentally fail to secure users against large receipt attachment overheads or accurately execute complex recurring payment tracking without utilizing expensive, server-heavy cron jobs.

2.2 The Proposed Solution
We propose a custom-engineered, web-based Web Expense Tracker explicitly powered by PHP 8, JavaScript (ES6+), and an ACID-compliant MySQL database. The solution introduces a robust Offline-First Queue System to logically differentiate between available server connectivity and immediate local state updates. 

It features a unique processing mechanism that compresses heavy images directly in the browser using the Canvas API before transferring lightweight base64 payloads to the backend. Using clever chronological queries during fetching instead of scheduled cron-jobs ("Lazy Auto-Logging"), the system mathematically ensures that recurring expenses trigger seamlessly without dedicated background server processes. By pushing the data integrity checks heavily to the PWA framework cache and synchronization layer, the system effectively immunizes itself against poor data connections and data loss.
  


                CHAPTER 3: COMPREHENSIVE TECHNOLOGY STACK ANALYSIS

3.1 Frontend Web Technologies: Structure, Style, and Behavior
The presentation layer of this application is crafted using the foundational web triad, purposefully avoiding dependencies on heavy compilers to maintain an incredibly lightweight, pure PWA core.

- HTML5 (HyperText Markup Language Revision 5): Used for the semantic structuring of the application views. Crucial inclusions include the `manifest.json` connectivity element allowing modern browsers to perceive the website as an installable standalone application.
- CSS3 (Cascading Style Sheets Level 3): Utilized for high-end, responsive styling. The project relies deeply on a newly engineered "Monochromatic Black and White Theme" centered around an advanced CSS concept known as Glassmorphism. Utilizing `backdrop-filter: blur()`, semi-transparent backgrounds render a professional frosted-glass pane floating natively across mobile dimensions.
- JavaScript (ES6+) & Service Workers (`sw.js`): The absolute command center of the frontend. Vanilla JavaScript powers the asynchronous data array logic, triggers Chart.js visual aggregations dynamically, interacts natively with the device camera via `<input type="file" capture="environment">`, invokes Notification API Permissions, and manages the robust `offlineQueue` algorithm bridging the gap to the PHP backend.

3.2 Server-Side Technology: PHP 8.x
- PHP (Hypertext Preprocessor): Operates entirely on the server to securely receive JSON payloads originating from the PWA. PHP actively decompresses and moves image assets into directories, processes secure user session verifications globally, updates internal transaction chronologies, and acts as the gatekeeper to the underlying MySQL environment.

3.3 Relational Database Management System: MySQL
- MySQL (InnoDB Engine): Selected for its support of ACID properties. The architecture relies on multiple interlinked relational tables (users, categories, expenses, recurring_expenses) secured via robust Foreign Keys implementing `ON DELETE CASCADE` actions.
- PDO (PHP Data Objects): The database component interacting securely between PHP/MySQL. The architecture strictly enforces Prepared Statements across every single database insertion/update operation, inherently negating advanced SQL Injection (SQLi) tactics.

3.4 Development, Environment, and Versioning Tools
- XAMPP / Apache Web Server: XAMPP provides the cross-platform Apache environment functioning as the active listener, parsing JSON endpoint requests and interacting intelligently with the backend language paths.
- Visual Studio Code (VS Code): The Integrated Development Environment (IDE) utilized for writing and formatting the extensive logic pipelines.
- Git / GitHub / Web Hosting: Distributed version control employed strictly to track systemic alterations in the codebase. The project integrates seamlessly with hosting ecosystems like InfinityFree allowing secure live access via `infinityfree_setup.sql` migrations.



CHAPTER 4: ADVANCED PROJECT DESIGN AND METHODOLOGY

4.1 Architectural Paradigms: The Offline-First PWA Model
The Web Expense Tracker adheres closely to modern Progressive Web App architecture, effectively inserting an intervention proxy layer between the Presentation Tier and Application Tier:
1. Presentation Tier (Client Layer): The UI that interacts instantly with LocalStorage and cached variables. It instantly registers user inputs on screen.
2. The Service Worker Proxy (The Interceptor): Using JavaScript background installation logic (`sw.js`). This layer caches network requests, allowing the UI to fetch files securely when no Wi-Fi exists.
3. Application Tier (Logic Layer Middleware): The Apache Server operating `api/expenses.php`. This tier verifies the network payloads, performs file handling for base64 URLs, executes mathematical date increments for recurring operations, and conducts security validation.
4. Data Tier (Persistence Layer): The MySQL database instance permanently indexing user records for long-term historical CSV aggregations.

4.2 Modular System Breakdown
The application structure is heavily decoupled into defined functional pipelines:
- Authentication Module (`auth.js`, `api/auth.php`): Handles credential encryption natively. The uniqueness of this app centers around the capability of the PWA to locally encrypt a recognized boolean session state offline, allowing safe access to cached UI modules even when the backend is completely unreachable. 
- The Offline Sync Engine (`js/app.js - syncOfflineData`): This unique array mechanism intercepts all POST, PUT, and DELETE methods. If `$navigator.onLine` reads as false, it appends unique negative temporary ID identifiers to objects and securely logs the action into a LocalStorage JSON string, executing sequentially only when the browser broadcasts a physical network reconnection.
- Image Compression Module (`updateReceiptLabel`): Ingests the camera device payload mapping it internally onto an invisible HTML `<canvas>`, rescaling and drastically reducing megabytes of JPG quality directly in JavaScript RAM prior to uploading.

4.3 Comprehensive Data Flow Diagrams (DFD)
Level 0 DFD (Context Diagram):
At the highest abstraction, the context diagram visualizes the major entities interacting with the digital proxy node.
[Mobile Device Camera] -> [JS Compression Unit] -> (Queue Logic) -> [PHP API Endpoint] -> [MySQL Storage Ledger]

Level 1 DFD (Logical Operations):
Deconstructing the system reveals precise internal processes.
- Process 1 (The PWA Disconnect): User adds expense off-grid -> JS throws simulated error -> Cath block intercepts payload -> Appends (-1) `fakeId` -> Displays visually on UI -> Enters `offlineQueue`.
- Process 2 (The Sync Pulse): Network Restored Callback -> Iterates `offlineQueue` Array -> Dispatches `fetch()` POST endpoint -> Server Confirms ID Creation -> Splices payload from local array -> Re-Renders exact database data to client.
- Process 3 (Recurring Auto-Log Interval): API Endpoint `/api/expenses.php` is accessed via GET -> Server queries `recurring_expenses` checking if `next_run_date <= CURDATE()` -> Initiates `while` loop appending records retroactively based on selected period logic (`modify('+1 week')`) -> Updates next marker date natively ensuring total automation without Cron usage.

4.4 Relational Database Design and Normalization Theory
The database was engineered up to the Third Normal Form (3NF) to effectively eliminate data anomalies across disparate ledger features. Transitive relationships across the application exist independently:
- The fundamental `expenses` table avoids generating category data points recursively; instead, utilizing foreign keys bridging `category_id` references to dynamic visual identifiers mapped on the category dictionary, successfully averting recursive update anomalies if a category's title mathematically changes.

4.5 Entity-Relationship Schema Specifications
1. Primary Entities Table (`users`):
   - `id`: INT(11), Auto-Incrementing Primary Key. 
   - `monthly_budget`: DECIMAL(10, 2), Stores the dynamic limiting metric for the visual warning bar computation.
   - `password_hash`: VARCHAR(255), Secures sensitive credentials using strictly cryptographic BCrypt procedures.

2. Ledger Table (`expenses`):
   - `id`: INT(11), Auto-Incrementing Primary Key.
   - `user_id`: INT(11), Foreign Key -> users(id).
   - `amount`: DECIMAL(10, 2).
   - `receipt_url`: VARCHAR(255), Serves as a dynamic web pointer mapping to the server's local file allocation node generated dynamically utilizing `uniqid()` string prefixes.

3. Automated Chronological Table (`recurring_expenses`):
   - `id`: INT(11), Auto-Incrementing Primary Key.
   - `period`: ENUM('weekly', 'monthly', 'yearly'), Dictates the interval logic variable.
   - `next_run_date`: DATE, The critical timestamp column actively analyzed during GET operations to enforce automation logic across the framework.


CHAPTER 5: EXHAUSTIVE SOURCE CODE IMPLEMENTATION AND EXECUTION

5.1 The Monochromatic Glassmorphism Implementation (CSS3 Frontend)
Creating a high-end application required overhauling the visual infrastructure emphasizing sleek minimalist designs. Glassmorphism was utilized extensively via CSS variables to deliver premium contrast.
```css
/* Core Glassmorphism Class applied to Dashboard Panels */
.dashboard-container {
    background: rgba(255, 255, 255, 0.03); 
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
}
```
This UI methodology ensures massive cognitive reduction for the targeted user, explicitly shifting emphasis strictly toward their total balance logic and corresponding budgetary limits. 

5.2 The Progressive Service Worker Integration (JavaScript)
The implementation of the service worker explicitly transitions this web application into a natively installable framework.
```javascript
// Register Service Worker in Primary JS File
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(() => {
        console.log('Service Worker Registered');
    });
}
// Native System Push Notification Engine implementation via SW
registration.showNotification('Web Expense Tracker', {
    body: "Don't forget to log your expenses for today!",
    icon: 'icon-192.png',
    tag: 'daily-reminder', 
});
```
By utilizing the powerful Service Worker API layer alongside standard Notification permissions, the application mimics high-tier native App Store distributions perfectly.

5.3 The Heart of the System: Offline Synchronization Logistics (JavaScript Framework)
The script `syncOfflineData()` operates essentially as the critical heartbeat of offline integrity maintenance. The logic processes historical operations strictly sequentially ensuring dependencies are preserved.
```javascript
async function syncOfflineData() {
    if (offlineQueue.length === 0) return;
    const processingQueue = [...offlineQueue];
    for (let q of processingQueue) {
        try {
            await fetch('api/expenses.php', {
                method: q.action,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(q.payload)
            });
            offlineQueue = offlineQueue.filter(item => item !== q);
            localStorage.setItem('offlineQueue', JSON.stringify(offlineQueue));
        } catch (e) {
            break; // Cease execution natively avoiding double-posting records dynamically
        }
    }
}
```
This sequential logic flow explicitly guarantees that while out-of-bounds actions reside locally inside the JSON memory, actual database writes only occur synchronously across secure connections utilizing proper schema configurations.

5.4 Relational Mathematics: Intelligent Recurring System Computation (PHP)
Engineering automated components traditionally entails establishing massive backend cron jobs running recursively every sixty seconds. Alternatively, "Lazy Execution" models were securely enforced optimizing overall processor requirements natively on the host server.
```php
$stmt = $conn->prepare("SELECT * FROM recurring_expenses WHERE user_id = ? AND next_run_date <= CURDATE()");
$stmt->execute([$user_id]);
$due_recurring = $stmt->fetchAll();

foreach ($due_recurring as $rec) {
    $next_run = new DateTime($rec['next_run_date']);
    $today = new DateTime();
    while ($next_run <= $today) {
        // Sequentially Insert Past Due Transaction dynamically
        $ins = $conn->prepare("INSERT INTO expenses (...) VALUES (...)");
        $ins->execute([...]);
        
        // Native DateTime Increment Configuration mapped to parameter requirement 
        $next_run->modify('+1 ' . rtrim($rec['period'], 'ly')); 
    }
    // Finalize interval date pointer utilizing atomic database replacement procedures
    $upd = $conn->prepare("UPDATE recurring_expenses SET next_run_date = ? WHERE id = ?");
}
```
By placing this mathematical calculation directly onto the GET route, the system completely automates the experience silently mapping recurring expenses actively to identical local database constraints effortlessly.


CHAPTER 6: SYSTEM RESULTS AND VISUAL OUTPUT VERIFICATION

6.1 User Interface Deliverables
(Note to presenter: The following visual components represent the final compiled states of the application. Please insert your captured screenshots corresponding to the descriptors below to finalize this chapter).

- Figure 6.1.1 - Progressive Installation: Showcasing the native browser "Add to Home Screen" indicator successfully converting the web project into an installable software interface.
- Figure 6.1.2 - The Monochromatic UI Array: The core voting interface presenting total balances mapped identically against dynamic doughnut charts indicating visual delineations natively utilizing abstract glassmorphism UI rules.
- Figure 6.1.3 - The Error Interceptor State (Offline Array): An essential screenshot demonstrating the state switch activating the "You are offline" UI banner prominently mapped mapping transactions exclusively into cached queues demarcated actively via a small sync icon.
- Figure 6.1.4 - Live Budget Tracker Bar System: Prominent representation of the dynamically incrementing progress bar reacting instantaneously displaying color changes dependent upon variable percentages against assigned total numerical limits natively dynamically via logic arrays.
- Figure 6.1.5 - CSV Output Document Representation: Visual display reflecting successful external system exports via native spreadsheet visualization components derived intelligently utilizing Javascript logic loops.


CHAPTER 7: ACADEMIC CONCLUSION AND FUTURE APPLICABILITY

7.1 Summary of Undertaking and Final Conclusion
The Web Expense Tracker PWA Microproject fundamentally succeeds in its primary objective: to construct, refine, and drastically modernize complex financial web paradigms utilizing offline-first engineering models. By aggressively integrating Service Workers with comprehensive asynchronous PHP array computations, this platform delivered an ecosystem flawlessly mimicking native iOS and Android environments entirely locally across desktop and generalized interfaces alike without compromising strict application connectivity rules. 

The essential achievement underpinning this structure consisted of eliminating manual database interventions via generating dynamic arrays implementing receipt compression utilizing native canvas environments, integrating recurring calculations mathematically, and mapping network dependencies strictly allowing offline operations to execute flawlessly. Through precise implementations of comprehensive 3NF normalizations and rigorous SQLi protections mapped efficiently, the engineering framework guarantees reliable data security parameters continuously successfully averting potential payload degradations effectively standing confidently as a secure web application prototype.

7.2 Extensions and Directions for Future Work
While the underlying structure operates efficiently fulfilling strict metric expectations consistently across logical arrays, the system fundamentally scales organically. Future algorithmic cycles structurally will inevitably consider deploying comprehensive enhancements mapping:

1. Optical Character Recognition (OCR) Scanning Analysis: Programmatically implementing logic APIs to intercept image uploads internally to accurately parse physical receipt text actively generating amount and category datasets without external manual form interference whatsoever generating complete data automation processes natively.
2. Cross Platform Encrypted Device Synchronization API: Structurally altering authentication boundaries mapping user identities effectively enabling instantaneous WebSocket polling mapping transaction structures in real time across mobile implementations utilizing multiple platform variables actively.
3. OAuth Open Banking Interfaces: Connecting Plaid API structural variables essentially parsing direct internal transactions natively utilizing direct banking ledgers essentially averting physical input requirements definitively.


REFERENCES

[1] PHP Official Documentation. PHP: Hypertext Preprocessor. Retrieved from https://www.php.net/docs.php
[2] MySQL 8.0 Reference Manual. Security and Access Control. Retrieved from https://dev.mysql.com/doc/refman/8.0/en/
[3] MDN Web Docs. HTML: HyperText Markup Language. Retrieved from https://developer.mozilla.org/en-US/docs/Web/HTML
[4] MDN Web Docs. CSS: Cascading Style Sheets. Retrieved from https://developer.mozilla.org/en-US/docs/Web/CSS
[5] MDN Web Docs. JavaScript. Retrieved from https://developer.mozilla.org/en-US/docs/Web/JavaScript
[6] MDN Web Docs. Progressive Web Apps (PWAs). Retrieved from https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps
[7] MDN Web Docs. Service Worker API. Retrieved from https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
[8] W3Schools. PHP PDO Database Access. Retrieved from https://www.w3schools.com/php/php_mysql_intro.asp
[9] PHP The Right Way. Password Hashing framework. Retrieved from https://phptherightway.com/#password_hashing
[10] CSS-Tricks. A Complete Guide to Flexbox. Retrieved from https://css-tricks.com/snippets/css/a-guide-to-flexbox/
[11] CSS-Tricks. A Complete Guide to Grid. Retrieved from https://css-tricks.com/snippets/css/complete-guide-grid/
[12] Glassmorphism in CSS. Retrieved from https://glassmorphism.com/
[13] Chart.js Documentation. Retrieved from https://www.chartjs.org/docs/latest/
[14] Font Awesome Iconic Font Library. Retrieved from https://fontawesome.com/
[15] W3Schools. PHP Form Handling and Validation. Retrieved from https://www.w3schools.com/php/php_forms.asp
[16] XAMPP Apache + MariaDB + PHP + Perl documentation. Retrieved from https://www.apachefriends.org/index.html
[17] GeeksforGeeks. PHP CRUD Operations with MySQLi. Retrieved from https://www.geeksforgeeks.org/php-crud-operations-with-php-mysql/
[18] Stack Overflow Community Solutions on Offline JavaScript Queueing constraints.
[19] InfinityFree Hosting Architecture and Database Parameters. Retrieved from https://infinityfree.com/
[20] GeeksforGeeks. Difference between Authentication and Authorization. Retrieved from https://www.geeksforgeeks.org/difference-between-authentication-and-authorization/
