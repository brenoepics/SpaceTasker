interface Project {
  id: number;
  name: string;
  description: string;
  country: string;
  status: string;
  objects?: string[];
}

export default Project;
