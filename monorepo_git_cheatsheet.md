# Ultimate Monorepo Git History Cheat Sheet

This cheat sheet serves as a permanent reference guide for managing **Jonas Schmedtmann's The Ultimate React Course** workspace inside a single master repository (Monorepo), while cleanly preserving individual project histories.

---

## 🛑 The Core Errors We Faced & Why They Happened

### 1. The `node_modules` Tracking Flood

- **The Error:** Your Source Control sidebar exploded with **10,000+ untracked files**.
- **Why it happened:** The root `.gitignore` file was either missing, unsaved, or accidentally moved out of the root folder during an branch checkout script. This left the massive global `node_modules/` folder completely unprotected.

### 2. The Embedded Submodule Lock (`create mode 160000`)

- **The Error:** Git tracked your subfolders as empty placeholder entities instead of looking inside them.
- **Why it happened:** The individual project folders (`03-pizza-menu`, etc.) still contained their old, internal hidden `.git` folders. Your root repository treated them as standalone "submodules" and locked them out of global tracking.

### 3. The Root-Dumping Trait (`-X subtree` failure)

- **The Error:** Running a merge script dumped the sub-project's `src` and `public` folders straight into your root directory instead of its subfolder.
- **Why it happened:** The standard `git merge -X subtree=path` command option has a quirk: it only auto-shifts incoming files into a folder if that folder _already contains files tracked by Git_. Because the target folder was completely brand new or empty, Git ignored the layout pathing selection and dumped all code at the root.

---

## 🛠️ The Permanent Resolution: The Clean Slate Strategy

To completely eliminate path conflicts, file overwrites, and tracking bugs, we switch entirely to **`git subtree add`**. This command acts as a strict atomic shield—it forcefully shapes both your files _and_ past history logs straight into a subdirectory on the very first try.

### Phase 1: Initialize the Master Base (Run Once)

1. Clean your root folder so that **only** your master configuration files (`package.json`, `.gitignore`, `.vscode/`) and your `projects/` directory exist. Wipe out any loose files from failed merges.
2. Run these commands at your master root directory to spin up a clean repository base:

```bash
# Completely deletes the old, corrupt tracking data database
rm -rf .git

# Initialize a perfectly clean tracking index
git init
git add .
git commit -m "Initial commit: Base monorepo layout setup"
```

### Phase 2: Strip Internal Databases (Run Once)

To ensure your project subfolders never attempt to act like locked submodules, cleanly wipe out their local tracking folders:

```bash
rm -rf projects/03-pizza-menu/.git
rm -rf projects/04-steps/.git
rm -rf projects/05-travel-list/.git
```

---

## 📋 The Reusable Subtree Formula

Whenever you want to pull a standalone learning project folder from your **Desktop** into your master **Monorepo** workspace while flawlessly stitching its unbroken Git log history into place, use this single-line command blueprint.

### The Master Template Format

```bash
git subtree add --prefix=projects/[FOLDER-NAME] /c/Users/realsam/Desktop/[FOLDER-NAME] main
```

### Quick Direct Copy-Paste Blocks

#### 1. Import Pizza Menu History:

```bash
git subtree add --prefix=projects/03-pizza-menu /c/Users/realsam/Desktop/03-pizza-menu main
```

#### 2. Import Steps History:

```bash
git subtree add --prefix=projects/04-steps /c/Users/realsam/Desktop/04-steps main
```

#### 3. Import Travel List History:

```bash
git subtree add --prefix=projects/05-travel-list /c/Users/realsam/Desktop/05-travel-list main
```

---

## 🚀 Daily Course Workflow (Moving Forward)

Now that your workspace ecosystem is permanently fixed, you never have to deal with complex history imports again! When Jonas introduces a new section (e.g., `07-usepopcorn`):

1. **Add Code Structure:** Extract or drop Jonas's new starter project folder directly inside your `projects/` directory layout.
2. **Hook Up Dependencies:** Open your terminal at the **root** folder and run `npm install`. Npm scans your new subdirectory config and links all packages instantly to the root `node_modules` folder using **0MB** of extra disk space.
3. **Launch the Application Local Server:** Navigate directly into that specific app and boot it:
   ```bash
   cd projects/07-usepopcorn
   npm start
   ```
4. **Track Changes Globally:** When you want to save your progress, do it entirely from the master root folder:
   ```bash
   git add .
   git commit -m "Section 7: Completed movie rating component layout"
   ```
