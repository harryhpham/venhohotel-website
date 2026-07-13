# VENHO_OS_UI_DESIGN_SPEC_v1.0

**Status:** LOCKED -- UI Design Blueprint

# 1. Design Goal

VenHo OS là một **Business Operating Workspace**, không phải Dashboard
KPI.

Mục tiêu của Home Workspace:

-   Biết việc quan trọng nhất ngay khi mở.
-   Tiếp tục công việc chỉ với 1--2 lần nhấp.
-   Giảm tải nhận thức.
-   Điều phối toàn bộ hệ thống.

------------------------------------------------------------------------

# 2. Desktop Layout

    ┌────────────────────────────────────────────────────────────────────────────┐
    │ Header                                                             User    │
    ├──────────────┬─────────────────────────────────────────────────────────────┤
    │ Sidebar      │ Today's Focus                                              │
    │              ├─────────────────────────────────────────────────────────────┤
    │              │ Current Work                                                │
    │              ├───────────────────────┬─────────────────────────────────────┤
    │              │ Needs Review          │ Ready to Publish                    │
    │              ├───────────────────────┴─────────────────────────────────────┤
    │              │ Quick Actions                                          3x2  │
    │              ├─────────────────────────────────────────────────────────────┤
    │              │ Recent Activity                                           │
    └──────────────┴─────────────────────────────────────────────────────────────┘

Sidebar: **240px**

Header: **72px**

Content padding: **32px**

Card gap: **24px**

Grid: **12 columns**

------------------------------------------------------------------------

# 3. Header

## Left

-   VENHO OS
-   Home Workspace

## Center

-   Current Project / Workspace

## Right

-   Last Sync
-   Notifications
-   User Menu

------------------------------------------------------------------------

# 4. Sidebar

-   🏠 Home Workspace
-   📁 Projects
-   📋 Tasks
-   🧠 Knowledge
-   ⚙️ Workbench
-   🎨 Creative Studio
-   🚀 Publishing
-   📊 Reports
-   ⚙ Settings

------------------------------------------------------------------------

# 5. Widget Specifications

## Today's Focus

Height: 140px

Fields: - Current Objective - Priority #1 - Milestone - Next Action -
ETA - Continue Button

------------------------------------------------------------------------

## Current Work

Height: 180px

Fields: - Task Title - Progress Bar - Step x / y - Status Badge -
Continue

------------------------------------------------------------------------

## Needs Review

Width: 50%

Maximum: 5 items

Each row: - Icon - Title - Source - Review Button

------------------------------------------------------------------------

## Ready to Publish

Width: 50%

Maximum: 5 items

Each row: - Platform - Content Title - Approve Button

------------------------------------------------------------------------

## Quick Actions

Grid: 3 × 2

Buttons: - Build DNA - Generate Prompt - Validate - Publish - Video -
Automation

Rounded Pill Buttons

------------------------------------------------------------------------

## Recent Activity

Timeline

Maximum 10 events

Each row:

-   Time
-   Event
-   Module
-   Open

------------------------------------------------------------------------

# 6. Creative Studio

Current Skills

-   Image Creator
-   Content Creator
-   Video Script Creator

Future

-   Voice
-   Video Generator
-   Thumbnail
-   Translation
-   SEO
-   Email

------------------------------------------------------------------------

# 7. Workbench

    Observe
       ↓
    DNA
       ↓
    Prompt
       ↓
    Validate
       ↓
    Automation
       ↓
    Video
       ↓
    Publishing

------------------------------------------------------------------------

# 8. Visual Design

Background: - #F8F7F4

Cards: - White - Radius 16px - Very Light Shadow

Font: - Inter

Primary: - #2F6F91

Spacing: - 8 / 16 / 24 / 32

------------------------------------------------------------------------

# 9. Responsive

Desktop: Sidebar + Content

Tablet: Collapsible Sidebar

Mobile: Bottom Navigation

Order:

Today's Focus

↓

Current Work

↓

Needs Review

↓

Ready to Publish

↓

Quick Actions

↓

Recent Activity

------------------------------------------------------------------------

# 10. UX Rules

-   One primary mission.
-   One primary task.
-   Every warning has an action.
-   No KPI wall.
-   No unnecessary charts.
-   Minimize scrolling.
-   One-click continuation.

------------------------------------------------------------------------

# 11. Future Integration

Reserved modules:

-   AI Studio
-   Hotel OS
-   Finance
-   CRM
-   Analytics
-   Agent System

------------------------------------------------------------------------

# 12. Definition of Done

-   Workspace-first experience.
-   Fast daily operation.
-   Unified navigation.
-   Ready for module integration.
-   Scalable without redesign.
