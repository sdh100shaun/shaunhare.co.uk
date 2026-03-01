---
title: Adopting a new language one microframework at a time
date: 2014-04-24
description: On the role micro-frameworks play in picking up a new programming language quickly, and why that process is more fun than it sounds.
---

# Adopting a new language one microframework at a time

*Published 24th April 2014*

---

Recently I had to start using a different language — Python — to maintain an existing project. It made me appreciate the role micro-frameworks have played in my adoption of new languages of late. By "of late" I mean the last few years. This article explores what role they play and how they can help in the immediate adoption of a new language.

## What is a micro-framework?

The frameworks are much of a muchness — very similar in their construction and patterns. These frameworks tend to consist of, or specialise in, a single part of a normal application (routing), and often achieve that goal in simple and similar ways. They generally encourage building small, tight, and loosely coupled components that can be assembled quickly by the developer, often driven from a single file.

Ease of understanding is by far the most common feature of most micro-frameworks. They contain significantly less code, fewer features, and little complexity — so they offer an unparalleled opportunity to understand how a minimalist implementation of a solution to a problem might be approached.

Getting a RESTful web application up and running is a fairly trivial task with most frameworks. Micro-services are an increasingly popular application architecture in enterprise infrastructure, as they allow for rapid development, smaller codebases, enterprise integration, and discrete deployable packages.

They tend to be delivered through Domain Specific Language implementations. Examples include Sinatra (Ruby), Silex (PHP), Flask (Python), SpringBoot (Java), Nancy for .NET — just Google; you'll find plenty. According to the [Thoughtworks Technology Radar](https://www.thoughtworks.com/radar), they're something worth adopting in your organisation.

## How they've helped me learn new languages

### 1. The similarities of structure help you understand the architecture quickly

The formulaic nature of routing and responding to HTTP requests means that, regardless of language, the concepts are similar — and more often than not the DSL implementations offer similar syntax. This removes the barrier of *how does this work* and lets you concentrate on *how do I express domain logic in this language*.

### 2. The ease of deployment makes failing fast a feature

Most frameworks come equipped with built-in servers or lean on lightweight middleware modules, so running them is as simple as executing a file and navigating to localhost. Short feedback loops are enormously useful when you're still finding your feet.

### 3. You are encouraged to write simple code

The modular nature of micro-frameworks means you're encouraged to stand on the shoulders of others, and the code you write tends to be focused and minimal. That constraint is a surprisingly good teacher.

### 4. They're fun

Fun and fast means you can achieve something real quickly, and immediate results are enormously motivating when you're picking up an unfamiliar language.

---

So next time you want to learn a new language — or just knock something together quickly in one you already know — pick up a micro-framework. It'll be well spent time.
