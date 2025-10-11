# Project Documentation

Welcome to the **Project Documentation**.  
This guide will help you understand the purpose, setup, and technical details of the project.

---

## Table of Contents

1. [Introduction](#introduction)
2. [System Requirements](#system-requirements)
3. [Installation](#installation)
   - [Project Dependencies](#1-installing-project-dependencies)
   - [AirSim Installation (Windows)](#2-installing-airsim-on-windows)
   - [AirSim Installation (Linux)](#3-installing-airsim-on-linux)
4. [Usage](#usage)
5. [API Reference](#api-reference)
6. [Contributing](#contributing)
7. [License](#license)

---

## Introduction

This project is built using **React** and demonstrates how to dynamically render **Markdown documentation** within a web application.

The React app utilizes:

- [`react-markdown`](https://github.com/remarkjs/react-markdown) for rendering `.md` files.
- [`react-syntax-highlighter`](https://github.com/react-syntax-highlighter/react-syntax-highlighter) for syntax-highlighted code blocks.

Additionally, this guide includes instructions for installing **Microsoft AirSim**, an open-source simulator for autonomous vehicles such as drones and cars.  
AirSim provides a realistic simulation environment for testing control algorithms, AI models, and sensor data processing systems.

---

## System Requirements

Before installation, ensure your system meets the following requirements:

| Component        | Recommended Version                |
| ---------------- | ---------------------------------- |
| Node.js          | 18.x or later                      |
| npm              | 9.x or later                       |
| Python           | 3.8 or later                       |
| Visual Studio    | 2019 or later (for Windows builds) |
| Unreal Engine    | 4.27 or later                      |
| Operating System | Windows 10/11 or Ubuntu 20.04+     |

---

## Installation

### 1. Installing Project Dependencies

Clone your React project and install all dependencies.

```bash
git clone <your-project-repo-url>
cd <project-directory>
npm install
```
