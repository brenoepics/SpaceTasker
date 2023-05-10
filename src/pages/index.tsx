import { Card, Pagination, Button, TextInput } from "flowbite-react";
import { useState, useEffect, FC } from "react";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";
import ReactCountryFlag from "react-country-flag";
import projects from "../data/projects.json";

const ProjectsPage: FC = function () {
  return (
    <NavbarSidebarLayout>
      <div className="px-4 pt-6 bg-transparent">
        <ProjectsList />
      </div>
    </NavbarSidebarLayout>
  );
};

const ProjectsList: FC = function () {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [projectList, setProjectList] = useState<Project[]>([]);

  const onPageChange = (page: number) => setCurrentPage(page);

  const calculateColumns = (screenWidth: number): number => {
    if (screenWidth >= 1280) {
      return 4;
    } else if (screenWidth >= 1024) {
      return 3;
    } else if (screenWidth >= 768) {
      return 2;
    } else {
      return 1;
    }
  };

  const [columns, setColumns] = useState(calculateColumns(window.innerWidth));
  const startIndex = (currentPage - 1) * (columns * 2);
  const endIndex = startIndex + columns * 2;
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    setTimeout(() => {
      setProjectList(projects);
      setLoading(false);
    }, 1000);
  }, []);

  const handleResize = () => {
    setColumns(calculateColumns(window.innerWidth));
  };

  return (
    <div className="px-4 pt-6 pb-6 bg-transparent">
      <div className={`grid grid-cols-${columns} gap-4 bg-transparent`}>
        {loading
          ? Array.from({ length: columns * 2 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          : projectList
              .slice(startIndex, endIndex)
              .map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
      </div>
      <div className="m-8 flex items-center justify-center">
        <Pagination
          currentPage={currentPage}
          onPageChange={onPageChange}
          showIcons={true}
          totalPages={Math.ceil(projectList.length / (columns * 2))}
        />
      </div>
    </div>
  );
};

type Project = {
  id: number;
  name: string;
  description: string;
  country: string;
  status: string;
  imageUrl: string;
};

type ProjectCardProps = {
  project: Project;
};

const ProjectCard: FC<ProjectCardProps> = function ({ project }) {
  const [isDamaged, setIsDamaged] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const image = new Image();
    image.onload = () => setLoading(false);
    image.src = project.imageUrl;
  }, [project.imageUrl]);

  return (
    <div className="h-full">
      <Card imgAlt={project.name} imgSrc={project.imageUrl} className="h-full">
        <div className="flex items-center justify-between">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {project.name}
          </h5>
        </div>
        <p className="font-normal text-gray-700 dark:text-gray-400 flex text-center items-center">
          <ReactCountryFlag
            className="emojiFlag mr-2"
            countryCode={project.country}
            style={{
              fontSize: "2em",
              lineHeight: "2em",
            }}
            svg
          />
          {loading ? (
            <div className="h-40 bg-gray-200 dark:bg-gray-600"></div> // Skeleton image
          ) : (
            <Button
              size={"sm"}
              gradientMonochrome={isDamaged ? "failure" : "success"}
              onClick={() => setIsDamaged(!isDamaged)}
            >
              {isDamaged ? "Avariado" : "Intacto"}
            </Button>
          )}
        </p>
        <Button gradientMonochrome="info">Ver mais</Button>
      </Card>
    </div>
  );
};

const SkeletonCard: FC = function () {
  return (
    <div className="h-full">
      <Card className="h-full">
        <div className="animate-pulse">
          <div className="h-20 bg-gray-200 dark:bg-gray-600"></div>
          <div className="h-4 my-2 bg-gray-200 dark:bg-gray-600"></div>
          <div className="h-4 my-2 bg-gray-200 dark:bg-gray-600"></div>
          <div className="h-8 my-2 bg-gray-200 dark:bg-gray-600"></div>
          <div className="h-40 bg-gray-200 dark:bg-gray-600"></div>
        </div>
      </Card>
    </div>
  );
};

export default ProjectsPage;
