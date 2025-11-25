import React from 'react';
import Link from 'next/link';
import courses from '../../../lib/courses';
import CoursePlayer from '../../../components/course-player';

type Props = {
  params: {
    id: string;
  };
};

export default function Page({ params }: Props) {
  const id = parseInt(params.id || '', 10);
  const course = courses.find((c) => c.id === id);

  if (!course) {
    return <div className="p-8">Course not found</div>;
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-4">
        <Link href="/" className="text-sm text-blue-600 hover:underline">← Back to home</Link>
        <div className="text-sm text-muted-foreground">Course • {course.title}</div>
      </div>

      <h1 className="text-2xl font-bold">{course.title}</h1>
      {course.description && <p className="mt-2 text-sm text-muted-foreground">{course.description}</p>}

      <CoursePlayer course={course} />
    </div>
  );
}
