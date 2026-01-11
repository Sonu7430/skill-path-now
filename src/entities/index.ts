/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: careers
 * Interface for Careers
 */
export interface Careers {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  careerName?: string;
  /** @wixFieldType text */
  careerDescription?: string;
  /** @wixFieldType text */
  requiredSkills?: string;
  /** @wixFieldType text */
  industry?: string;
  /** @wixFieldType number */
  averageSalary?: number;
  /** @wixFieldType image */
  careerImage?: string;
}


/**
 * Collection ID: learningresources
 * Interface for LearningResources
 */
export interface LearningResources {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  resourceName?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  resourceType?: string;
  /** @wixFieldType url */
  resourceURL?: string;
  /** @wixFieldType number */
  estimatedDurationMinutes?: number;
  /** @wixFieldType text */
  difficultyLevel?: string;
  /** @wixFieldType image */
  thumbnail?: string;
}


/**
 * Collection ID: skillassessmentquestions
 * Interface for SkillAssessmentQuestions
 */
export interface SkillAssessmentQuestions {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  questionText?: string;
  /** @wixFieldType text */
  questionType?: string;
  /** @wixFieldType text */
  skillArea?: string;
  /** @wixFieldType text */
  options?: string;
  /** @wixFieldType number */
  difficultyLevel?: number;
  /** @wixFieldType text */
  correctAnswer?: string;
}
