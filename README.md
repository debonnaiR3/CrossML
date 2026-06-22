# CrossML Agent Directory

An enterprise-grade, responsive React web application designed for internal CrossML team members to browse, search, manage, and inspect cross-company agent dossiers. 

Built to strictly adhere to modern React architecture patterns, Client-Side Role-Based Access Control (RBAC), and zero-dependency local state persistence.

---

## Live Testing Credentials

On initial local spin-up, the client automatically seeds `localStorage` with two test profiles:

* **Administrator**
  * **Email:** `admin@crossml.com`
  * **Password:** `password123`

* **Viewer**
  * **Email:** `viewer@crossml.com`
  * **Password:** `password123`

---

## Git Branch Architecture

This repository was built using isolated feature branches. You can inspect the codebase at specific assessment stages:

* `main` *(Active)* — Master branch 
* `assignment-3` — Seperate Employee Detail page, Role-Based UI, Inline Form Validation

To jump to another branch:
```bash
git checkout <branch-name>