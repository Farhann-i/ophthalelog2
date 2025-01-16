import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar, Tag, User } from "lucide-react";
import { format } from "date-fns";
import { casesService } from "../../services/cases.service";
import type { Case } from "../../types";

function getYouTubeEmbedUrl(url: string) {
  try {
    const videoId = url.includes("youtu.be")
      ? url.split("youtu.be/")[1]
      : url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return url;
  }
}

function getGoogleDriveViewUrl(url: string) {
  try {
    if (url.includes("drive.google.com")) {
      const fileId = url.match(/[-\w]{25,}/);
      if (fileId) {
        return `https://drive.google.com/thumbnail?id=${fileId[0]}`;
        // return `https://drive.google.com/uc?export=view&id=${fileId[0]}`;
      }
    }
    return url;
  } catch {
    return url;
  }
}

export default function CaseDetails() {
  const { id } = useParams<{ id: string }>();
  const [case_, setCase] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCase = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await casesService.getCase(id);
        setCase(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load case");
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !case_) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
          <p className="text-red-600">{error || "Case not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{case_.summary}</h2>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <User className="mr-1.5 h-4 w-4" />
            <span>Patient ID: {case_.patientId}</span>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Calendar className="mr-1.5 h-4 w-4" />
            <time dateTime={case_.createdAt}>
              {format(new Date(case_.createdAt), "MMM d, yyyy")}
            </time>
          </div>

          <div className="prose max-w-none mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Clinical Findings
            </h3>
            <div dangerouslySetInnerHTML={{ __html: case_.clinicalFindings }} />
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {case_.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Media</h3>
            <div className="grid grid-cols-1 gap-6">
              {case_.images.map((media, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  {media.type === "image" ? (
                    <img
                      src={getGoogleDriveViewUrl(media.url)}
                      alt={`Case image ${index + 1}`}
                      className="w-full h-auto"
                    />
                  ) : (
                    <div className="aspect-video">
                      <iframe
                        src={getYouTubeEmbedUrl(media.url)}
                        title={`Case video ${index + 1}`}
                        className="w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
