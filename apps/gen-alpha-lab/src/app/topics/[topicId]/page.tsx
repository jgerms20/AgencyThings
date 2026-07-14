import { notFound } from "next/navigation";
import TopicDetail from "@/components/TopicDetail";
import { findingTopics, getTopicById } from "@/lib/findings";

type TopicPageProps = {
  params: Promise<{ topicId: string }>;
};

export function generateStaticParams() {
  return findingTopics.map((topic) => ({ topicId: topic.id }));
}

export async function generateMetadata({ params }: TopicPageProps) {
  const { topicId } = await params;
  const topic = getTopicById(topicId);

  return {
    title: topic ? `${topic.pageTitle} | Gen Alpha Intelligence Lab` : "Topic | Gen Alpha Intelligence Lab",
    description: topic?.thesis
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { topicId } = await params;
  const topic = getTopicById(topicId);

  if (!topic) notFound();

  return <TopicDetail topic={topic} />;
}
