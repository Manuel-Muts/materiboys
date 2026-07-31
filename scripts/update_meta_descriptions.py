from pathlib import Path
import re

mapping = {
    'docs/about/index.html': "Learn about Materi Boys' Senior School mission, values and community-driven approach to character and academic excellence.",
    'docs/academics/index.html': "Explore Materi Boys' academic pathways in STEM, Social Sciences, Arts & Sport Science with student-centered curriculum and skills development.",
    'docs/admissions/index.html': "Apply for Materi Boys' admissions with step-by-step guidance, application details, and entry requirements for new students.",
    'docs/alumni/index.html': "Explore Materi Boys alumni stories, achievements, and ways former students stay connected with the school community.",
    'docs/contact/index.html': "Contact Materi Boys' Senior School for admissions enquiries, campus visits, or more information about our programs.",
    'docs/downloads/application-form.html': "Download the Materi Boys application form and begin the student admissions process with all required enrollment details.",
    'docs/downloads/fee-schedule.html': "View Materi Boys' current fee schedule for tuition, boarding, and program costs for the upcoming academic year.",
    'docs/downloads/interview-requirements.html': "Review the Materi Boys admissions interview requirements, documentation checklist, and next steps for enrolment.",
    'docs/downloads/prospectus.html': "Download the Materi Boys prospectus for program overviews, campus facilities, and admissions information.",
    'docs/facilities/index.html': "Explore Materi Boys facilities including labs, sports fields, classrooms and boarding that support learning and wellbeing.",
    'docs/history/index.html': "Discover Materi Boys' history, milestones and how the school has grown to support future-ready learners.",
    'docs/home/index.html': "Discover Materi Boys' Senior School programs, facilities, admissions and community — start your enrolment journey today.",
    'docs/mission/index.html': "Read Materi Boys' mission and vision for building character, leadership and academic success in every student.",
    'docs/privacy/index.html': "Read Materi Boys' privacy policy to learn how the school protects personal data and handles information responsibly.",
    'docs/staff/index.html': "Meet the Materi Boys faculty and leadership teams, with profiles of their roles, expertise and school responsibilities.",
    'docs/teachers/index.html': "Browse the Materi Boys teachers gallery to meet our academic and subject specialist staff with portraits and roles.",
    'docs/terms/index.html': "Read Materi Boys' website terms of use, legal notices, and rules for acceptable site behavior and content.",
    'docs/vacancies/index.html': "Browse current Materi Boys vacancies for teaching and support roles, plus application guidance for new candidates.",
    'vacancies/index.html': "Browse current school vacancies and recruitment updates for Materi Boys' careers and support roles.",
}

pattern = re.compile(r'(<meta[^>]*?name=["\']description["\'][^>]*?content=["\'])([^"\']*)(["\'])', re.IGNORECASE | re.DOTALL)

for relative_path, description in mapping.items():
    path = Path(relative_path)
    if not path.exists():
        print(f'WARNING: missing file {relative_path}')
        continue
    text = path.read_text(encoding='utf-8')
    new_text, count = pattern.subn(lambda m: m.group(1) + description + m.group(3), text, count=1)
    if count != 1:
        print(f'WARNING: description meta not found in {relative_path}')
        matches = re.findall(r'<meta[^>]*?name=["\']description["\'][^>]*?>', text, re.IGNORECASE | re.DOTALL)
        print(f'  found {len(matches)} description meta tags in {relative_path}')
        continue
    path.write_text(new_text, encoding='utf-8')
    print(f'updated {relative_path}')
