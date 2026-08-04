"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { comparisonDimensions } from "@/lib/content/comparisons";

const overviewTopics = comparisonDimensions.slice(0, 3);

export default function OverviewComparison() {
  const [activeTopicId, setActiveTopicId] = useState(overviewTopics[0].id);
  const activeTopic = overviewTopics.find((topic) => topic.id === activeTopicId) ?? overviewTopics[0];
  const genZComparison = activeTopic.comparisons.genZ;

  return (
    <section className="overview-comparison" aria-label="Gen Alpha versus Gen Z snapshot">
      <header>
        <h2>Gen Alpha versus Gen Z, topic by topic.</h2>
        <Link className="text-link" href="/compare">Compare more topics and cohorts <ArrowUpRight aria-hidden="true" size={17} /></Link>
      </header>

      <div className="overview-topic-controls" aria-label="Comparison topics">
        {overviewTopics.map((topic) => (
          <button
            aria-pressed={activeTopic.id === topic.id}
            key={topic.id}
            onClick={() => setActiveTopicId(topic.id)}
            type="button"
          >
            {topic.title}
          </button>
        ))}
      </div>

      <div className="overview-comparison-result" aria-live="polite">
        <div>
          <p>Gen Alpha mentality</p>
          <h3>{activeTopic.genAlpha.mentality}</h3>
        </div>
        <div>
          <p>Gen Z mentality</p>
          <h3>{genZComparison.cohort.mentality}</h3>
        </div>
        <div className="overview-real-difference">
          <strong>Strategic interpretation</strong>
          <p>{genZComparison.realDifference}</p>
          <p className="overview-comparison-example"><span>In real life</span>{genZComparison.everydayExample}</p>
        </div>
      </div>
    </section>
  );
}
