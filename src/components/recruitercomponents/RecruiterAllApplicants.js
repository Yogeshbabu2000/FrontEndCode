import React, { useState, useEffect, useRef } from 'react';
import { useUserContext } from '../common/UserProvider';
import { apiUrl } from '../../services/ApplicantAPIService';
import axios from 'axios';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import Snackbar from '../common/Snackbar';
import BackButton from '../common/BackButton';
import filtericon from '../../images/filter 2.svg';
import verified123 from '../../images/verified123.svg';
import arrowleft from '../../images/arrow-left.svg';
import { Typeahead } from 'react-bootstrap-typeahead';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSlidersH } from '@fortawesome/free-solid-svg-icons';
import "./RecruiterManageColumn.css"


$.DataTable = require('datatables.net')

 
function RecruiterAllApplicants() {
  const [applicants, setApplicants] = useState([]);
  const { user } = useUserContext();
  let [selectedApplicant, setSelectedApplicant] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedMenuOption, setSelectedMenuOption] = useState('All');
  const isMounted = useRef(true);
  const [search, setSearch] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('');
  const tableref=useRef(null);
  const filterRef = useRef([]);
  const [urlParams, setUrlParams] = useState('');
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [mobileNumber, setMobileNumber] = useState(null);
  const [jobTitle, setJobTitle] = useState(null);
  const [applicantStatus, setApplicantStatus] = useState(null);
  const [skillName, setSkillName] = useState(null);
  const [minimumExperience, setMinimumExperience] = useState(0);
  const [location, setLocation] = useState(null);
  const [minimumQualification, setMinimumQualification] = useState(null);
  const [specialization, setspecialization] = useState(null);
  const [preScreenedCondition, setPreScreenedCondition] = useState(null);
  const [apptitudeScore, setapptitudeScore] = useState(null);
  const [technicalScore, settechnicalScore] = useState(null);
  const [matchPercentage, setmatchPercentage] = useState(null);
  const [matchedSkills, setmatchedSkills] = useState(null);
  const [nonMatchedSkills, setnonMatchedSkills] = useState(null);
  const [additionalSkills, setadditionalSkills] = useState(null);
  const [applicantSkillBadges, setapplicantSkillBadges] = useState(null);
  const [preferredJobLocations, setpreferredJobLocations] = useState(null);
  const [count, setCount] = useState(0);
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', type: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipVisibleId, setTooltipVisibleId] = useState(null);
  const [initialData, setInitialData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [availableNameSuggestions, setAvailableNameSuggestions] = useState([]);
  const [availableEmailSuggestions, setAvailableEmailSuggestions] = useState([]);
  const [availableMobileSuggestions, setAvailableMobileSuggestions] = useState([]);
  const [availableJobTitleSuggestions, setAvailableJobTitleSuggestions] = useState([]);
  const [availableStatusSuggestions, setAvailableStatusSuggestions] = useState([]);
  const [availableExpSuggestions, setAvailableExpSuggestions] = useState([]);
  const [availableQualSuggestions, setAvailableQualSuggestions] = useState([]);
  const [availableSpecSuggestions, setAvailableSpecSuggestions] = useState([]);
  const [availablePreSuggestions, setAvailablePreSuggestions] = useState([]);
  const [availableAptiSuggestions, setAvailableAptiSuggestions] = useState([]);
  const [availableTeciSuggestions, setAvailableTeciSuggestions] = useState([]);
  const [availableJobMatchSuggestions, setAvailableJobMatchSuggestions] = useState([]);
  const [availableMatchSkillSuggestions, setAvailableMatchSkillSuggestions] = useState([]);
  const [availableNonMatchSkillSuggestions, setAvailableNonMatchSkillSuggestions] = useState([]);
  const [availableAdditonalSkillSuggestions, setAvailableAdditonalSkillSuggestions] = useState([]);
  const [availableSkillBadgesSuggestions, setAvailableSkillBadgesSuggestions] = useState([]);
  const [availablePreferedLocSuggestions, setAvailablePreferedLocSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [FilterData, setFilterData] = useState([]);
  const [appliedFilter,setAppliedFilter]=useState(false)
  
  const recordsPerPage = 10;
  

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = applicants.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(applicants.length / recordsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };
  

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };
  
  const desiredOrder = [
    'New',
    'Screening',
    'Shortlisted',
    'Interviewing',
    'Selected',
    'Rejected'
  ];
  
  // Remove duplicates from availableStatusSuggestions
  const uniqueStatusSuggestions = Array.from(new Set(availableStatusSuggestions));
  
  // Filter uniqueStatusSuggestions to match the desired order
  const validStatusSuggestions = desiredOrder.filter(status =>
    uniqueStatusSuggestions.includes(status)
  );
  
  

  const validPreferredLocSuggestions = Array.from(
    new Set(availablePreferedLocSuggestions.filter(location => location)) // Remove duplicates
  ).map(location => ({
    label: location.toString(),  // Ensure label is a string for display
    value: location              // Value can be used for selection or backend logic
  }));

  const validSkillBadgesSuggestions = Array.from(
    new Set(availableSkillBadgesSuggestions.filter(skill => skill)) // Remove duplicates
  ).map(skill => ({
    label: skill.toString(),  // Ensure label is a string for display
    value: skill              // Value can be used for selection or backend logic
  }));


  const validAdditonalSkillSuggestions = Array.from(
    new Set(availableAdditonalSkillSuggestions.filter(skill => skill)) // Remove duplicates
  ).map(skill => ({
    label: skill.toString(),  // Ensure label is a string for display
    value: skill              // Value can be used for selection or backend logic
  }));

  const validNonMatchSkillSuggestions = Array.from(
    new Set(availableNonMatchSkillSuggestions.filter(skill => skill)) // Remove duplicates
  ).map(skill => ({
    label: skill.toString(),  // Ensure label is a string for display
    value: skill              // Value can be used for selection or backend logic
  }));

 // Convert these into objects with label and value
 const validJobMatchSkillSuggestions = Array.from(
  new Set(availableMatchSkillSuggestions.filter(skill => skill)) // Remove duplicates
).map(skill => ({
  label: skill.toString(),  // Ensure label is a string for display
  value: skill              // Value can be used for selection or backend logic
}));

  // Convert these into objects with label and value
const validJobMatchSuggestions = availableJobMatchSuggestions
.filter(score => score != null) // Filter out null and undefined values
.map(score => ({
  label: score.toString(),  // Convert number to string for display
  value: score
}));


// Convert these into objects with label and value
const validAptiSuggestions = availableAptiSuggestions
  .filter(score => score != null) // Filter out null and undefined values
  .map(score => ({
    label: score.toString(),  // Convert number to string for display
    value: score
  }));
  const [showError, setShowError] = useState(false);

  // Convert these into objects with label and value
const validTeciSuggestions = availableTeciSuggestions
.filter(score => score != null) // Filter out null and undefined values
.map(score => ({
  label: score.toString(),  // Convert number to string for display
  value: score
}));


 
const [selectedCheckboxes, setSelectedCheckboxes] = useState({
  Experience:false,
  Qualification:false,
  "Location":false,
  Speclization: false,
  "Apptitude Score": false,
  "Technical Score": false,
  "Matching Skills":false,
  "Missing Skills":false,
  "Additional Skills":false,
  "Tested Skills":false,
  "Job Match%":false
});

const [errorMessage, setErrorMessage] = useState('');

const [selectedColumns, setSelectedColumns] = useState([]);

const toggleSidebar = () => {
  setIsOpen(!isOpen);
};

const handleCheckboxs = (event) => {
  const { name, checked } = event.target;
  setSelectedCheckboxes((prev) => ({ ...prev, [name]: checked }));
};

const handleApply = () => {
  const selected = Object.keys(selectedCheckboxes).filter((key) => selectedCheckboxes[key]);
  if(selected.length===0){
    setErrorMessage('Please select at least one column.')
    return;
  }
  else {
    setErrorMessage('');
    // alert('Selected Columns: ' + selected.join(', '));
    setSelectedColumns(selected);
    // reset();
    toggleSidebar();
  }
};


const reset = () => {
  setSelectedCheckboxes({
  Experience:false,
  Qualification:false,
  "Location":false,
  Speclization: false,
  "Apptitude Score": false,
  "Technical Score": false,
  "Matching Skills":false,
  "Missing Skills":false,
  "Additional Skills":false,
  "Tested Skills":false,
  "Job Match%":false
  });
  setSelectedColumns([]);
  setErrorMessage('');
  toggleSidebar();
};

  const m=new Map();
  const handleCheckboxChange2 = (applyjobid) => {
    m.set(currentPage,applyjobid);
    setSelectedApplicants((prevSelected) => {
      if (prevSelected.includes(applyjobid)) {
        // If the ID is already in the array, remove it (uncheck the box)
        return prevSelected.filter((id) => id !== applyjobid);
      } else {
        // If the ID is not in the array, add it (check the box)
        return [...prevSelected, applyjobid];
      }
    });
  };
  const handleSelectAll = (event) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      const allIds = currentRecords.map(application => application.applyjobid);
      setSelectedApplicants(allIds);
      // console.log(currentRecords)
    } else {
      setSelectedApplicants([]);
    }
  };
 
 
  const [filterOptions, setFilterOptions] = useState({
    nameFilter: false,
    emailFilter: false,
    mobileFilter: false,
    jobFilter: false,
    statusFilter: false,
    skillFilter: false,
    experienceFilter: false,
    locationFilter: false,
    minimumQualification: false,
    specialization: false,
    preScreenedCondition: false,
    apptitudeScore: false,
    technicalScore: false,
    matchPercentage: false,
    matchedSkills: false,
    nonMatchedSkills: false,
    additionalSkills: false,
    applicantSkillBadges: false,
    preferredJobLocations: false
 
  });
 
  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', type: '' });
    window.location.reload();
  };
 
  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
    setFilterOptions(prevState => ({
      ...prevState,
      [id]: checked ? 'is' : null
    }));
  };
  
  const handleCheckboxChange3 = (event) => {
    const { id, checked } = event.target;
    setFilterOptions(prevState => ({
      ...prevState,
      [id]: checked ? 'ascending' : null
    }));
  };
  
  const resetFilter = () => {
 
  window.location.reload();
};



const applyFilter = () => {
  // Apply all filters on the frontend based on the selected options
  setCurrentPage(1)
  setAppliedFilter(true)
  // Check if at least one filter is selected
  const isAnyFilterSelected = Object.values(filterOptions).some((filter) => filter);

  if (!isAnyFilterSelected) {
    // Show error message if no filter is selected
    setShowError(true);
  } else {
    // Apply filter logic here
    setShowError(false);
    // Your filter application logic
  }


  const filteredData = initialData.filter((applicant) => {
      
    return (
      (name === "" || applyMatchType(applicant.name, name, filterOptions.nameFilter)) &&
      (email === "" || applyMatchType(applicant.email, email, filterOptions.emailFilter)) &&
      (mobileNumber === "" || applyMatchType(applicant.mobilenumber, mobileNumber, filterOptions.mobileFilter)) &&
      (jobTitle === "" || applyMatchType(applicant.jobTitle, jobTitle, filterOptions.jobFilter)) &&
      (applicantStatus === "" || applyStatusMatchType(applicant.applicantStatus, applicantStatus, filterOptions.statusFilter)) &&
      (skillName === "" || applyMatchType(applicant.skillName, skillName, filterOptions.skillFilter)) &&
      (location === "" || applyMatchType(applicant.location, location, filterOptions.locationFilter)) &&
      (minimumExperience === null || applyExperienceMatchType(applicant.experience, minimumExperience, filterOptions.experienceFilter)) &&
      (minimumQualification === "" || applyMatchType(applicant.minimumQualification, minimumQualification, filterOptions.minimumQualification))&&
      (specialization === "" || applyMatchType(applicant.specialization, specialization, filterOptions.specialization))&&
      (preScreenedCondition === "" || applyScreenedMatchType(applicant.preScreenedCondition, preScreenedCondition, filterOptions.preScreenedCondition))&&
       (apptitudeScore === "" || applyScoreMatchType(applicant.apptitudeScore, apptitudeScore, filterOptions.apptitudeScore))&&
      (technicalScore === "" || applyScoreMatchType(applicant.technicalScore, technicalScore, filterOptions.technicalScore))&&
      (technicalScore === "" || applyScoreMatchType(applicant.matchPercentage, matchPercentage, filterOptions.matchPercentage))&&
      (matchedSkills === "" || applySkillMatchType(applicant.matchedSkills, matchedSkills, filterOptions.matchedSkills))&&
      (nonMatchedSkills === "" || applySkillMatchType(applicant.nonMatchedSkills, nonMatchedSkills, filterOptions.nonMatchedSkills))&&
      (additionalSkills === "" || applySkillMatchType(applicant.additionalSkills, additionalSkills, filterOptions.additionalSkills))&&
      (preferredJobLocations === "" || applyLocationMatchType(applicant.preferredJobLocations, preferredJobLocations, filterOptions.preferredJobLocations))&&
      (applicantSkillBadges === "" || applySkillBadgeMatchType(applicant.applicantSkillBadges, applicantSkillBadges, filterOptions.applicantSkillBadges))
      
      
      
    );
  });
  setFilterData(filteredData)
  console.log('Applicants before filtering:', filteredData);


  if (filterOptions.applicantSkillBadges) {
    // Iterate in reverse to safely remove elements from the array
    for (let i = filteredData.length - 1; i >= 0; i--) {
      const applicant = filteredData[i];
      // Check if matchedSkills exists and is not empty
      if (!applicant.applicantSkillBadges || applicant.applicantSkillBadges.length === 0) {
        // Remove the applicant if matchedSkills is not valid
        filteredData.splice(i, 1);
      }
    }
  }

  if (filterOptions.additionalSkills) {
    // Iterate in reverse to safely remove elements from the array
    for (let i = filteredData.length - 1; i >= 0; i--) {
      const applicant = filteredData[i];
      // Check if matchedSkills exists and is not empty
      if (!applicant.additionalSkills || applicant.additionalSkills.length === 0) {
        // Remove the applicant if matchedSkills is not valid
        filteredData.splice(i, 1);
      }
    }
  }

  if (filterOptions.matchedSkills) {
    // Iterate in reverse to safely remove elements from the array
    for (let i = filteredData.length - 1; i >= 0; i--) {
      const applicant = filteredData[i];
      // Check if matchedSkills exists and is not empty
      if (!applicant.matchedSkills || applicant.matchedSkills.length === 0) {
        // Remove the applicant if matchedSkills is not valid
        filteredData.splice(i, 1);
      }
    }
  }
  if (filterOptions.nonMatchedSkills) {
    // Iterate in reverse to safely remove elements from the array
    for (let i = filteredData.length - 1; i >= 0; i--) {
      const applicant = filteredData[i];
      // Check if matchedSkills exists and is not empty
      if (!applicant.nonMatchedSkills || applicant.nonMatchedSkills.length === 0) {
        // Remove the applicant if matchedSkills is not valid
        filteredData.splice(i, 1);
      }
    }
  }
  

  if(filterOptions.matchPercentage ){
          // Now, sort the filtered data based on matchPercentage filter
          
        filteredData.sort((a, b) => {
          const scoreA = typeof a.matchPercentage === 'string' ? parseInt(a.matchPercentage.trim(), 10) : Math.round(a.matchPercentage);
          const scoreB = typeof b.matchPercentage === 'string' ? parseInt(b.matchPercentage.trim(), 10) : Math.round(b.matchPercentage);

          if (filterOptions.matchPercentage=== "ascending") {
            return scoreA - scoreB; // Ascending order
          } else if (filterOptions.matchPercentage === "descending") {
            return scoreB - scoreA; // Descending order
          }

          return 0; // If no sorting is selected, return 0
        });
  }
  
  if(filterOptions.technicalScore ){
    // Now, sort the filtered data based on matchPercentage filter
    
  filteredData.sort((a, b) => {
    const scoreA = typeof a.technicalScore === 'string' ? parseInt(a.technicalScore.trim(), 10) : Math.round(a.technicalScore);
    const scoreB = typeof b.technicalScore === 'string' ? parseInt(b.technicalScore.trim(), 10) : Math.round(b.technicalScore);

    if (filterOptions.technicalScore=== "ascending") {
      return scoreA - scoreB; // Ascending order
    } else if (filterOptions.technicalScore === "descending") {
      return scoreB - scoreA; // Descending order
    }

    return 0; // If no sorting is selected, return 0
  });
}

if(filterOptions.apptitudeScore ){
  // Now, sort the filtered data based on matchPercentage filter
 
filteredData.sort((a, b) => {
  const scoreA = typeof a.apptitudeScore === 'string' ? parseInt(a.apptitudeScore.trim(), 10) : Math.round(a.apptitudeScore);
  const scoreB = typeof b.apptitudeScore === 'string' ? parseInt(b.apptitudeScore.trim(), 10) : Math.round(b.apptitudeScore);

  if (filterOptions.apptitudeScore=== "ascending") {
    return scoreA - scoreB; // Ascending order
  } else if (filterOptions.apptitudeScore === "descending") {
    return scoreB - scoreA; // Descending order
  }

  return 0; // If no sorting is selected, return 0
});
}

const handleCheckboxChange3 = (applyjobid) => {
  // Toggle the applicant's selection state
  setSelectedApplicants((prevSelected) => {
    if (prevSelected.includes(applyjobid)) {
      // If the ID is already in the array, remove it (uncheck the box)
      return prevSelected.filter((id) => id !== applyjobid);
    } else {
      // If the ID is not in the array, add it (check the box)
      return [...prevSelected, applyjobid];
    }
  });

  // Check if all checkboxes are selected
  const allCheckboxes = document.querySelectorAll('input[type="checkbox"][name^="applicantCheckbox-"]');
  const allChecked = Array.from(allCheckboxes).every(checkbox => checkbox.checked);

  // Uncheck the "Select All" checkbox if any individual checkbox is unchecked
  const selectAllCheckbox = document.getElementById("selectAllCheckbox");
  if (!allChecked) {
    selectAllCheckbox.checked = false;
  } else {
    selectAllCheckbox.checked = true;
  }
};

// Assuming this is your select all logic
const handleFilterData = (event) => {
  const isChecked = event.target.checked;
  if (isChecked) {
    const allIds = FilterData.map(applicant => applicant.applyjobid);
    setSelectedApplicants(allIds);
  } else {
    setSelectedApplicants([]);
  }

  // Set all checkboxes' checked state to match the header checkbox
  document.querySelectorAll('input[type="checkbox"][name^="applicantCheckbox-"]').forEach((checkbox) => {
    checkbox.checked = isChecked;
  });
};
const recordsPerPage = 10; 
let currentPage = 1;

function handleNextPage1() {
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  if (currentPage < totalPages) {
    currentPage += 1;
    renderTableData();  // Call the function to render data for the new page
  }
}

function handlePreviousPage1() {
  if (currentPage > 1) {
    currentPage -= 1;
    renderTableData();  // Call the function to render data for the new page
  }
}

function renderTableData() {
const tableHeader=document.getElementById("tableHeader");
tableHeader.innerHTML = `
  <th>
    <input
    type="checkbox"
    id="selectAllCheckbox"
    />
  </th>
  <th>Name</th>
  <th>Email</th>
  <th>Mobile Number</th>
  <th>Job Title</th>
  <th>Applicant Status</th>
  ${selectedColumns.includes('Experience') ? '<th>Experience</th>' : ''}
  ${selectedColumns.includes('Qualification') ? '<th>Qualification</th>' : ''}
  ${selectedColumns.includes('Location') ? '<th>Location</th>' : ''}
  ${selectedColumns.includes('Speclization') ? '<th>Specialization</th>' : ''}
  ${selectedColumns.includes('Apptitude Score') ? '<th>Apptitude Score</th>' : ''}
  ${selectedColumns.includes('Technical Score') ? '<th>Technical Score</th>' : ''}
  ${selectedColumns.includes('Matching Skills') ? '<th>Matching Skills</th>' : ''}
  ${selectedColumns.includes('Missing Skills') ? '<th>Missing Skills</th>' : ''}
  ${selectedColumns.includes('Additional Skills') ? '<th>Additional Skills</th>' : ''}
  ${selectedColumns.includes('Tested Skills') ? '<th>Tested Skills</th>' : ''}
  ${selectedColumns.includes('Job Match%') ? '<th>Job Match%</th>' : ''}
  <th>Resume</th>
`;
 
  const selectAllCheckbox = document.getElementById("selectAllCheckbox");
  selectAllCheckbox.addEventListener('change', handleFilterData);
 
 
const tableBody = document.getElementById("applicantTableBody");
  tableBody.innerHTML = "";
  if (filteredData.length === 0) {
    // Display "No data found" message
    const noDataRow = document.createElement("tr");
    noDataRow.innerHTML = `
      <td colspan="${selectedColumns.length + 7}" style="text-align: center;">
        No Data Found</td>
    `;
    tableBody.appendChild(noDataRow);
  }else{
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;

  const recordsToDisplay = filteredData.slice(startIndex, endIndex);
  setFilterData(recordsToDisplay)
  
  recordsToDisplay.forEach((applicant,index) => {
   
    const row = document.createElement("tr");
   
    row.innerHTML = `
  <td>
    <input
      type="checkbox"
      value="${applicant.applyjobid}"
      ${selectedApplicants.includes(applicant.applyjobid) ? 'checked' : ''}
      name="applicantCheckbox-${applicant.applyjobid}"
    />
  </td>
  <td>   
  <a href="/viewapplicant/${applicant.id}?jobid=${applicant.jobId}&appid=${applicant.id}" style="color: #0583D2; text-decoration: none;">
    ${applicant.name}
  </a>
  ${applicant.preScreenedCondition === 'PreScreened'
    ? `
      <div style="display: inline-block; position: relative;">
        <img 
          src="${verified123}" 
          alt="Verified" 
          style="width: 20px; height: 20px; margin-left: 5px;"
          onMouseEnter="this.nextElementSibling.style.display='block';" 
          onMouseLeave="this.nextElementSibling.style.display='none';"
        />
        <div style="
            display: none;
            position: absolute;
            bottom: 100%;
            left: 1250%;
            top: ${index === filteredData.length - 1 ? '-70px' : '25px'};
            transform: translateX(-50%);
            background-color: #fff;
            border: 1px solid #ccc;
            border-radius: 5px;
            width: 615px;
            height: 70px;
            white-space: normal;
            box-shadow: 0px 4px 15px 0px rgba(0,0,0,0.15);
            z-index: 1000;
            overflow: hidden;
            padding-right: 50px;
            padding-top: 5px;
        ">
  <div style="
    display: flex; /* Use flexbox for alignment */
    align-items: center; /* Center the image and text vertically */
    padding: 5px; /* Add padding for the inner div */
  ">
    <img 
      src="${verified123}" 
      alt="Verified" 
      style="width: 20px; margin-right: 15px; margin-left: 10px;" 
    />
    <span style="flex: 1; white-space: normal;">
      Pre-screened badges are issued to candidates who scored more than 70% in both Aptitude and Technical tests.
    </span>
  </div>
</div>
      </div>`
    : ''}
</td>

  <td><a href="/viewapplicant/${applicant.id}?jobid=${applicant.jobId}&appid=${applicant.id}" style="color: #0583D2; text-decoration: none;">${applicant.email}</a></td>
  <td><a href="/viewapplicant/${applicant.id}?jobid=${applicant.jobId}&appid=${applicant.id}" style="color: #0583D2; text-decoration: none;">${applicant.mobilenumber}</a></td>
  <td>${applicant.jobTitle}</td>
  <td style="padding: 0px 10px; text-align: center; vertical-align: middle;">
    <div style="display: inline-flex; justify-content: flex-start; align-items: center; gap: 10px; border-radius: 14px; background: ${
      (() => {
        switch (applicant.applicantStatus) {
          case 'Shortlisted':
            return '#DBFAEB';
          case 'Selected':
            return '#F9F5FF';
          case 'Rejected':
            return '#FFF3F4';
          case 'Screening':
            return '#EFFFD0';
          case 'Interviewing':
            return '#FFF2E1';
          default:
            return '#F8F8F8'; // Default background for unknown status
        }
      })()
    }; color: ${
      (() => {
        switch (applicant.applicantStatus) {
          case 'Shortlisted':
            return '#2D6A4F';
          case 'Selected':
            return '#6C3FB6';
          case 'Rejected':
            return '#FF4D4F';
          case 'Screening':
            return '#718F00';
          case 'Interviewing':
            return '#F7B267';
          default:
            return '#000'; // Default color for unknown status
        }
      })()
    }; justify-content: flex-start; padding: 0px 10px;">
      ${applicant.applicantStatus}
    </div>
  </td>
 
  ${selectedColumns.includes('Experience') ? `<td>${applicant.experience}</td>` : ''}
 
  ${selectedColumns.includes('Qualification') ? `<td>${applicant.qualification}</td>` : ''}
 
  ${selectedColumns.includes("Location") ? `
    <td>
      ${applicant.preferredJobLocations.length > 3
        ? `${applicant.preferredJobLocations.slice(0, 3).join(", ")} +`
        : applicant.preferredJobLocations.join(", ")}
    </td>` : ''}
 
  ${selectedColumns.includes("Speclization") ? `<td>${applicant.specialization}</td>` : ''}
 
  ${selectedColumns.includes("Apptitude Score") ? `<td>${applicant.apptitudeScore}</td>` : ''}
 
  ${selectedColumns.includes("Technical Score") ? `<td>${applicant.technicalScore}</td>` : ''}
 
  ${selectedColumns.includes("Matching Skills") ? `
    <td>
      ${applicant.matchedSkills.length > 3
        ? `${applicant.matchedSkills.slice(0, 3).map(skill => skill.skillName).join(", ")} +`
        : applicant.matchedSkills.map(skill => skill.skillName).join(", ")}
    </td>` : ''}
 
  ${selectedColumns.includes("Missing Skills") ? `
    <td>
      ${applicant.nonMatchedSkills.length > 3
        ? `${applicant.nonMatchedSkills.slice(0, 3).map(skill => skill.skillName).join(", ")} +`
        : applicant.nonMatchedSkills.map(skill => skill.skillName).join(", ")}
    </td>` : ''}
 
  ${selectedColumns.includes("Additional Skills") ? `
    <td>
      ${applicant.additionalSkills.length > 3
        ? `${applicant.additionalSkills.slice(0, 3).map(skill => skill.skillName).join(", ")} +`
        : applicant.additionalSkills.map(skill => skill.skillName).join(", ")}
    </td>` : ''}
 
  ${selectedColumns.includes("Tested Skills") ? `
    <td>
      ${applicant.applicantSkillBadges && applicant.applicantSkillBadges.length > 3
        ? `${applicant.applicantSkillBadges.slice(0, 3).map(skill => skill.skillBadge.name).join(", ")} +`
        : applicant.applicantSkillBadges
          ? applicant.applicantSkillBadges.map(skill => skill.skillBadge.name).join(", ")
          : "No skills available"}
    </td>` : ''}
 
  ${selectedColumns.includes("Job Match%") ? `<td>${applicant.matchPercentage}%</td>` : ''}
 
  <td><a href="/view-resume/${applicant.id}" style="color: blue;">View</a></td>
`;
 
 
    tableBody.appendChild(row);
 
    const checkbox = row.querySelector(`input[type="checkbox"][value="${applicant.applyjobid}"]`);
 
    checkbox.addEventListener('change', () => {
      handleCheckboxChange3(applicant.applyjobid);
    });
    });
  }
    function renderPagination() {
      const totalPages = Math.ceil(filteredData.length / recordsPerPage);
      const paginationContainer = document.createElement("div");
      paginationContainer.className = "pagination-containers";
    
      paginationContainer.innerHTML = `
        <button id="prevButton" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
        <span>${currentPage}</span>
        <button id="nextButton" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
      `;
    
      // Clear existing pagination
      let existingPaginationContainer = document.querySelector(".pagination-containers");
      if (existingPaginationContainer) {
        existingPaginationContainer.remove();
      }

      let existsentirediv = document.querySelector(".entireDivClass");
      if (existsentirediv) {
        existsentirediv.remove();
      }
      
      // Append new pagination controls
      const entireDiv = document.createElement("div");
      entireDiv.className = "entireDivClass";
      entireDiv.appendChild(paginationContainer);
      entireDiv.style.height = "50px";
      entireDiv.style.display = "flex";
      entireDiv.style.justifyContent = "flex-end"; // Align items to the right
      entireDiv.style.alignItems = "center";
    
      const x = document.getElementsByClassName("profile-setting");
      if (x[0]) {
        x[0].appendChild(entireDiv);
      }
      const prevButton = document.getElementById('prevButton');
      const nextButton = document.getElementById('nextButton');

      // Ensure the elements exist before adding event listeners
      if (prevButton) {
          prevButton.addEventListener('click', handlePreviousPage1);
      }

      if (nextButton) {
          nextButton.addEventListener('click', handleNextPage1);
      }

      if (filteredData.length === 0) {
        // Optionally, you could disable the buttons or show a message
        prevButton.disabled = true;
        nextButton.disabled = true;
      }
    }
    renderPagination();
  }
  setCount(filteredData.length);
  renderTableData();
};

const applyMatchType = (value, filterValue, matchType) => {
  // Ensure value and filterValue are both strings
  const normalizedValue = value ? value.toString().toLowerCase() : '';
  const normalizedFilterValue = filterValue ? filterValue.toString().toLowerCase() : '';

  if (!matchType || !filterValue) return true;

  if (matchType === "contains") {
    return normalizedValue.includes(normalizedFilterValue);
  } else if (matchType === "is") {
    return normalizedValue === normalizedFilterValue;
  }
  
  return true;
};
const applyScreenedMatchType = (value, filterValue, matchType) => {
 
 if (matchType === null ||matchType === false) return true;

  filterValue="PreScreened";
  // Ensure value and filterValue are both strings
  const normalizedValue = value ? value.toString().toLowerCase() : '';
  const normalizedFilterValue = filterValue ? filterValue.toString().toLowerCase() : '';
  

  if (matchType === "is") {
    return normalizedValue === normalizedFilterValue;
  }
  
  return true;
};

const applyStatusMatchType = (value, filterValue, matchType) => {
  // Ensure value and filterValue are both strings
  const normalizedValue = value ? value.toString().toLowerCase() : '';
  const normalizedFilterValue = filterValue ? filterValue.toString().toLowerCase() : '';

  if (!filterValue) return true;

   
    return normalizedValue === normalizedFilterValue;
 
  
  return true;
};

const applyExperienceMatchType = (experience, filterValue, matchType) => {
  if (!matchType || filterValue === null) return true;
  
  const exp = parseInt(experience.trim(), 10);
  
  if (matchType === "greaterThan") {
    return exp > filterValue;
  } else if (matchType === "lessThan") {
    return exp < filterValue;
  } else if (matchType === "is") {
    return exp === filterValue;
  }
  return true;
};

const applyScoreMatchType = (score, filterValue, matchType) => {
  // If matchType is not defined or filterValue or score is null, return true
  if (!matchType) return true;

  // Convert score to an integer
  const parsedScore = typeof score === 'string' ? parseInt(score.trim(), 10) : Math.round(score);

  let parsedFilterValue;
  if (Array.isArray(filterValue) && filterValue.length > 0) {
    parsedFilterValue = filterValue[0].value; // Get the value from the first object
  } else {
    parsedFilterValue = typeof filterValue === 'string'
      ? parseInt(filterValue.trim(), 10)  // Convert string to integer
      : Math.round(filterValue);           // Round if it's a number
  }

  // Handle case where filterValue is not a valid number
  if (isNaN(parsedFilterValue)) {
    return false;
  }

  // Handle ascending and descending sorting
  if (matchType === "ascending") {
    return parsedScore - parsedFilterValue; // Return the difference for ascending sort
  } else if (matchType === "descending") {
    return parsedFilterValue - parsedScore; // Invert the difference for descending sort
  }

  

  return true;
};


const applySkillMatchType = (applicantSkills, filterSkills, matchType) => {
  // Ensure applicantSkills is an array, and filterSkills is a string or array
  if (applicantSkills === null) return null;
  if (!applicantSkills || applicantSkills.length === 0 || filterSkills === null) return true;
   
  // Normalize filterSkills to be an array for consistency
  const filterSkillsArray = Array.isArray(filterSkills) ? filterSkills : [filterSkills];
    // Extract values from filterSkillsArray
    const filterValues = filterSkillsArray.map(skill => skill.value || skill); // Use skill.value or skill if it's a string

    
  // Iterate over each filter skill and check if it matches any of the applicant's skills
  return filterValues.every(filterSkill => {
    return applicantSkills.some(applicantSkill => 
      applyMatchType(applicantSkill.skillName, filterSkill, matchType)
    );
  });
};
const applySkillBadgeMatchType = (applicantSkillBadges, filterSkills, matchType) => {
 

  // Return true if there are no applicantSkillBadges or filterSkills is null
  if (!applicantSkillBadges || applicantSkillBadges.length === 0 || filterSkills === null) return true;

  // Normalize filterSkills to be an array for consistency
  const filterSkillsArray = Array.isArray(filterSkills) ? filterSkills : [filterSkills];

  // Extract values from filterSkillsArray
  const filterValues = filterSkillsArray.map(skill => skill.value || skill);

  console.log('Filter values to match:', filterValues);

  // Iterate over each filter skill and check if it matches any of the applicant's skill badges
  return filterValues.every(filterSkill => {
    return applicantSkillBadges.some(applicantSkillBadge =>
      applyMatchType(applicantSkillBadge.skillBadge.name, filterSkill, matchType)
    );
  });
};


const applyLocationMatchType = (applicantLocations, filterLocations, matchType) => {
  // Return null if applicantLocations is null
  if (applicantLocations === null) return null;

  // Return true if there are no applicantLocations or filterLocations is null
  if (!applicantLocations || applicantLocations.length === 0 || filterLocations === null) return true;

  console.log('Checking applicant locations against filter locations');

  // Normalize filterLocations to be an array for consistency
  const filterLocationsArray = Array.isArray(filterLocations) ? filterLocations : [filterLocations];

  // Extract values from filterLocationsArray
  const filterValues = filterLocationsArray.map(location => location.value || location);

  console.log('Filter values to match:', filterValues);

  // Use matching logic based on the matchType
  if (matchType === 'is') {
    // Check if any of the applicant's locations exactly match any of the filter locations
    return applicantLocations.some(applicantLocation =>
      filterValues.includes(applicantLocation)
    );
  } else if (matchType === 'contains') {
    // Check if any of the applicant's locations contain any of the filter locations
    return applicantLocations.some(applicantLocation =>
      filterValues.some(filterLocation => 
        applicantLocation.includes(filterLocation)
      )
    );
  }

  // Default case if matchType is not recognized
  console.warn('Unrecognized match type:', matchType);
  return false;
};



 
const handleTextFieldChange = (id, value) => {
  // const { id, value } = e.target;
  switch (id) {
    case "name":
      setName(value);
      break;
    case "email":
      setEmail(value);
      break;
    case "mobileNumber":
      setMobileNumber(value);
      break;
    case "jobTitle":
      setJobTitle(value);
      break;
    case "applicantStatus":
      setApplicantStatus(value);
      break;
    case "skillName":
      setSkillName(value);
      break;
    case "minimumExperience":
      setMinimumExperience(value);
      break;
    case "location":
      setLocation(value);
      break;
    case "minimumQualificationInput":
      setMinimumQualification(value);
      break;
    case "specializationInput":
      setspecialization(value);
      break;
    case "preScreenedConditionInput":
      setPreScreenedCondition(value);
      break;
    case "apptitudeScoreInput":
      setapptitudeScore(value);
      break;
    case "technicalScoreInput":
      settechnicalScore(value);
      break;
    case "matchPercentageInput":
      setmatchPercentage(value);
      break;
    case "matchedSkillsInput":
      setmatchedSkills(value);
      break;
    case "nonMatchedSkillsInput":
      setnonMatchedSkills(value);
      break;          
    case "additionalSkillsInput":
      setadditionalSkills(value);
      break;   
    case "applicantSkillBadgesInput":
      setapplicantSkillBadges(value);
      break;      
    case "preferredJobLocationsInput":
      setpreferredJobLocations(value);
      break;  
      
    default:
      break;
  }
};
 
 
 
 
  const handleFilterChange = (event) => {
    const { name, checked, value } = event.target;
    const updatedFilters = [...selectedFilter];
 
    if (checked) {
      updatedFilters.push({ name, value });
    } else {
      const index = updatedFilters.findIndex((filter) => filter.name === name);
      if (index !== -1) {
        updatedFilters.splice(index, 1);
      }
    }
 
    setSelectedFilter(updatedFilters);
 
   
    const filteredApplicants = applicants.filter((applicant) => {
      return updatedFilters.every((filter) => {
       
      });
    });
 
   
    setApplicants(filteredApplicants);
  };
  useEffect(() => {
    filterRef.current.forEach((checkbox) => {
      checkbox.addEventListener('change', handleFilterChange);
    });
 
    return () => {
   
      filterRef.current.forEach((checkbox) => {
        checkbox.removeEventListener('change', handleFilterChange);
      });
    };
  }, [selectedFilter]);

  const [isLoading, setIsLoading] = useState(true); // Loading state
  const fetchAllApplicants = async () => {
    setIsLoading(true); // Start loading

    try {
      const response = await axios.get(`${apiUrl}/applyjob/recruiter/${user.id}/appliedapplicants`);
    const applicantsArray = Object.values(response.data).flat();
    setCount(applicantsArray.length);
    setApplicants(applicantsArray);
    setInitialData(applicantsArray);  // Store initial data
    // Extract names from applicants and update availableSuggestions
     // Update all suggestion arrays based on the applicants' data
     setAvailableNameSuggestions(applicantsArray.map(applicant => applicant.name));
     setAvailableEmailSuggestions(applicantsArray.map(applicant => applicant.email));
     setAvailableMobileSuggestions(applicantsArray.map(applicant => applicant.mobilenumber));
     setAvailableJobTitleSuggestions(applicantsArray.map(applicant => applicant.jobTitle));
     setAvailableStatusSuggestions(applicantsArray.map(applicant => applicant.applicantStatus));
     setAvailableExpSuggestions(applicantsArray.map(applicant => applicant.experience));
     setAvailableQualSuggestions(applicantsArray.map(applicant => applicant.minimumQualification));
     setAvailableSpecSuggestions(applicantsArray.map(applicant => applicant.specialization));
     setAvailablePreSuggestions(applicantsArray.map(applicant => applicant.preScreenedCondition));
     setAvailableAptiSuggestions(applicantsArray.map(applicant => applicant.apptitudeScore));
     setAvailableTeciSuggestions(applicantsArray.map(applicant => applicant.technicalScore));
     setAvailableJobMatchSuggestions(applicantsArray.map(applicant => applicant.matchPercentage));
     setAvailableMatchSkillSuggestions(
      applicantsArray.flatMap(applicant => 
        applicant.matchedSkills.map(skill => skill.skillName)  // Map through matchedSkills for each applicant
      )
    );
    setAvailableNonMatchSkillSuggestions(
      applicantsArray.flatMap(applicant => 
        applicant.nonMatchedSkills.map(skill => skill.skillName)  // Map through matchedSkills for each applicant
      )
    );
    setAvailableAdditonalSkillSuggestions(
      applicantsArray.flatMap(applicant => 
        applicant.additionalSkills.map(skill => skill.skillName)  // Map through matchedSkills for each applicant
      )
    );
    setAvailableSkillBadgesSuggestions(
      applicantsArray.flatMap(applicant => 
        applicant?.applicantSkillBadges?.map(skill => skill.skillBadge.name) || []  // Use optional chaining
      )
    );
    setAvailablePreferedLocSuggestions(
      applicantsArray.flatMap(applicant =>
        applicant?.preferredJobLocations?.map(location => location) || []  // Use optional chaining
      )
    );
    
        const $table= window.$(tableref.current);
          const timeoutId = setTimeout(() => {  
            if ($table.DataTable().data().length > 0) {
              $table.DataTable().destroy();
            }
          
            const dataTable = $table.DataTable({
              responsive: true,
              searching: false,
              lengthChange: false,
              info: false,
              paging: false,
              pageLength: 10, 
              columnDefs: [
                {
                    targets: [0,7],
                    orderable: false  
                }
              ]
            });
          
            const pageInfo = dataTable.page.info(); 
          
            if (pageInfo && pageInfo.pages > 0) {
              const totalPages = pageInfo.pages; 
          
              const paginationContainer = window.$('#paginationContainer');
              paginationContainer.empty(); 
          
              for (let i = 0; i < totalPages; i++) {
                const pageButton = window.$('<button>')
                  .text(i + 1)
                  .on('click', () => {
                    dataTable.page(i).draw(false); 
                  })
                  .css({
                    margin: '0 5px',
                    padding: '5px 10px',
                    cursor: 'pointer',
                  });
          
                if (i === pageInfo.page) {
                  pageButton.prop('disabled', true);
                }
          
                paginationContainer.append(pageButton);
              }
            } else {
              console.warn('No pages available or page info is undefined.');
            }
          }, 500);
         return () => {
            isMounted.current = false;
         };
    } catch (error) {
      console.error('Error fetching applicants:', error);
    }finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    if (isMounted.current) {
      fetchAllApplicants();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);
 
  useEffect(() => {
    const jwtToken = localStorage.getItem('jwtToken');
    if (jwtToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
    }
    fetchAllApplicants();
  }, [user.id]);
 
  const handleSelectChange1 = (e) => {
    
    const { id, value } = e.target;
  
    switch (id) {
      case "nameFilterSelect":
        setFilterOptions(prevState => ({
          ...prevState,
          nameFilter: value
        }));
       
        break;
      case "emailFilterSelect":
        setFilterOptions(prevState => ({
          ...prevState,
          emailFilter: value
        }));
        break;
      case "mobileFilterSelect":
        setFilterOptions(prevState => ({
          ...prevState,
          mobileFilter: value
        }));
        break;
      case "jobFilterSelect":
        setFilterOptions(prevState => ({
          ...prevState,
          jobFilter: value
        }));
        break;
      case "statusFilterSelect":
        setFilterOptions(prevState => ({
          ...prevState,
          statusFilter: value
        }));
        break;
      case "skillFilterSelect":
        setFilterOptions(prevState => ({
          ...prevState,
          skillFilter: value
        }));
        break;
      case "experienceFilterSelect":
        setFilterOptions(prevState => ({
          ...prevState,
          experienceFilter: value
        }));
        break;
      case "locationFilterSelect":
        setFilterOptions(prevState => ({
          ...prevState,
          locationFilter: value
        }));
        break;
      case "minimumQualificationSelect":
        setFilterOptions(prevState => ({
          ...prevState,
          minimumQualification: value
        }));
        break;
      case "specializationSelect":
        setFilterOptions(prevState => ({
          ...prevState,
          specialization: value
        }));
        break; 
      case "preScreenedConditionSelect":
        setFilterOptions(prevState => ({
          ...prevState,
          preScreenedCondition: value
        }));
        break; 
      case "apptitudeScoreFilterSelect":
        setFilterOptions(prevState => ({
          ...prevState,
          apptitudeScore: value
        }));
        break; 
      case "technicalScoreFilterSelect":
        setFilterOptions(prevState => ({
            ...prevState,
            technicalScore: value
        }));
        break;  
      case "matchPercentageFilterSelect":
        setFilterOptions(prevState => ({
            ...prevState,
            matchPercentage: value
          }));
          break;
      case "matchedSkillsFilterSelect":
        setFilterOptions(prevState => ({
            ...prevState,
            matchedSkills: value
          }));
          break;
      case "nonMatchedSkillsFilterSelect":
        setFilterOptions(prevState => ({
            ...prevState,
            nonMatchedSkills: value
          }));
          break; 
      case "additionalSkillsFilterSelect":
        setFilterOptions(prevState => ({
            ...prevState,
            additionalSkills: value
          }));
          break;
      case "applicantSkillBadgesFilterSelect":
        setFilterOptions(prevState => ({
            ...prevState,
            applicantSkillBadges: value
          }));
          break;                  
      case "preferredJobLocationsFilterSelect":
        setFilterOptions(prevState => ({
            ...prevState,
            preferredJobLocations: value
          }));
          break;         
          
      default:
        break;
    }
  };
const handleSelectChange = async (e) => {
  const newStatus = e.target.value;
 
  try {
    if (selectedApplicants.length > 0 && newStatus) {
      console.log("Selected Applicants:", selectedApplicants);
      const updatePromises = selectedApplicants.map(async (selectedApplicant) => {
        const applyJobId = selectedApplicant;
        console.log("Apply Job ID:", applyJobId);
        if (!applyJobId) {
          console.error("applyjobid is undefined or null for:", selectedApplicant);
          return null;
        }
 
        const response = await axios.put(
          `${apiUrl}/applyjob/recruiters/applyjob-update-status/${applyJobId}/${newStatus}`
        );
        return { applyJobId, newStatus };
      });
 
      const updatedResults = await Promise.all(updatePromises);
 
      const filteredResults = updatedResults.filter(result => result !== null);
     
      if (isMounted.current) {
        const updatedApplicants = applicants.map((application) => {
          const updatedResult = filteredResults.find(result => result.applyJobId === application.applyjobid);
          if (updatedResult) {
            return { ...application, applicantStatus: updatedResult.newStatus };
          }
          return application;
        });
        setApplicants(updatedApplicants);
        setSelectedStatus(newStatus);
        setSelectedApplicants([]);
      }
     
     
      const applicantCount = selectedApplicants.length;
const applicantLabel = applicantCount === 1 ? 'applicant' : 'applicants';
const message1 = `Status changed to ${newStatus} for ${applicantCount} ${applicantLabel}`;

setSnackbar({ open: true, message: message1, type: 'success' });
     
    }
  } catch (error) {
    console.error('Error updating status:', error);
  }
};
 
 
const exportCSV = () => {
  const headers = [
    'Name',
    'Email',
    'Mobile Number',
    'Job Title',
    'Applicant Status',
    ...selectedColumns,
    'Resume'
  ];
 
  const capitalizedHeaders = headers.map(header => header.toUpperCase());
 
  const escapeCSVField = (field) => {
    if (typeof field !== 'string') {
      return ' '; 
    }
    if (field.trim() === '') {
      return ' ';
    }
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  };
 
  let allData = Array.from(tableref.current.querySelectorAll('tbody tr')).map(tr => {
    if (!tr) return [];  
 
    const rowData = Array.from(tr.children).map((td, index) => {
      const cellContent = escapeCSVField(td.textContent.trim());
 
      const headerRow = tr.closest('table').querySelector('thead tr');
      if (!headerRow) return cellContent;  
 
      const headerText = headerRow.children[index]?.textContent.trim();
 
      switch (index) {
        case 1:
          const enameElement = td.querySelector('a') || td.querySelector('Link');
          return enameElement ? `${escapeCSVField(enameElement.textContent.trim())}` : '';
        case 2:
          console.log(cellContent);
          return cellContent;
        case 3:
          const mobileNumber = cellContent.replace(/\D/g, '');
          return mobileNumber.length === 10 ? mobileNumber : '';
        case 4:
          return cellContent;
        case 5:
          const applicantStatus = td.querySelector('div');
          return applicantStatus ? `${escapeCSVField(applicantStatus.textContent.trim())}` : '';
        default:
          break;
      }
 
      if (headerText === 'Experience') {
        return cellContent;
      }
 
      if (headerText === 'Qualification') {
        return cellContent;
      }
 
      if (headerText === 'Location') {
        const locationText = cellContent;
        const locations = locationText.split(',');
        const displayedLocations = locations.length > 3
          ? `${locations.slice(0, 3).join(", ")} +`
          : locations.join(", ");
        return displayedLocations.trim();
      }
 
      if (headerText === 'Specialization') {
        return cellContent;
      }
 
      if (headerText === 'Apptitude Score') {
        return cellContent;
      }
 
      if (headerText === 'Technical Score') {
        return cellContent;
      }
 
      if (headerText === 'Job Match%') {
        return cellContent;
      }
 
      if (headerText === 'Resume') {
        const resumeLink = td.querySelector('a')?.href;
        return resumeLink ? `"=HYPERLINK(""${resumeLink}"", ""View Resume"")"` : 'N/A';
      }
 
      return cellContent;
    });
 
    return rowData.slice(1);
  });
 
  let allData1 = applicants.map(applicant => {
    const rowData = [];
  
    rowData.push(escapeCSVField(applicant.name)); // Name
    rowData.push(escapeCSVField(applicant.email)); // Email
    rowData.push(escapeCSVField(applicant.mobilenumber)); // Mobile Number
    rowData.push(escapeCSVField(applicant.jobTitle)); // Job Title
    rowData.push(escapeCSVField(applicant.applicantStatus)); // Applicant Status
  
    if (selectedColumns.includes('Experience')) {
      rowData.push(escapeCSVField(applicant.experience));
    }
    if (selectedColumns.includes('Qualification')) {
      rowData.push(escapeCSVField(applicant.qualification));
    }
  
    if (selectedColumns.includes('Location') && applicant.preferredJobLocations) {
      let locations = applicant.preferredJobLocations;
    
      if (Array.isArray(locations)) {
        locations = locations.map(location => location.trim());
      } else if (typeof locations === 'string') {
        locations = locations.split(',').map(location => location.trim());
      } else {
        locations = [];
      }
    
      const displayedLocations = locations.length > 3 
        ? `${locations.slice(0, 3).join(", ")} +` 
        : locations.join(", ");
    
      rowData.push(escapeCSVField(displayedLocations)); 
    }

    // Remove the else block that was pushing an empty string

    if (selectedColumns.includes('Speclization')) {
      rowData.push(escapeCSVField(applicant.specialization));
    }
    if (selectedColumns.includes('Apptitude Score')) {
      rowData.push(applicant.apptitudeScore); 
    }
    if (selectedColumns.includes('Technical Score')) {
      rowData.push(applicant.technicalScore); 
    }

    // Matching Skills
    if (selectedColumns.includes('Matching Skills')) {
      let matchingSkills = applicant.matchedSkills;

      if (Array.isArray(matchingSkills)) {
        matchingSkills = matchingSkills.map(skill => skill.skillName).join(', ');
      } else {
        matchingSkills = ''; 
      }

      rowData.push(escapeCSVField(matchingSkills)); 
    }

    // Missing Skills
    if (selectedColumns.includes('Missing Skills')) {
      let missingSkills = applicant.nonMatchedSkills;

      if (Array.isArray(missingSkills)) {
        missingSkills = missingSkills.map(skill => skill.skillName).join(', ');
      } else {
        missingSkills = ''; 
      }

      rowData.push(escapeCSVField(missingSkills)); 
    }

    // Additional Skills
    if (selectedColumns.includes('Additional Skills')) {
      let additionalSkills = applicant.additionalSkills;

      if (Array.isArray(additionalSkills)) {
        additionalSkills = additionalSkills.map(skill => skill.skillName).join(', ');
      } else {
        additionalSkills = ''; 
      }

      rowData.push(escapeCSVField(additionalSkills)); 
    }

    if (selectedColumns.includes('Tested Skills')) {
      let testedSkills = applicant.applicantSkillBadges;

      if (Array.isArray(testedSkills)) {
        testedSkills = testedSkills.map(skill => skill.skillBadge.name).join(', '); 
      } else {
        testedSkills = ''; 
      }

      rowData.push(escapeCSVField(testedSkills));
    }
    
    if (selectedColumns.includes('Job Match%')) {
      rowData.push(`${applicant.matchPercentage}%`); 
    }
  
    const resumeLink = `${window.location.origin}/view-resume/${applicant.id}`;
    const hyperlinkFormula = resumeLink ? `"=HYPERLINK(""${resumeLink}"", ""View Resume"")"` : 'N/A';
    rowData.push(hyperlinkFormula);

    return rowData;
});

  // console.log(allData1)
  
  const selectedPages = new Set();
  selectedApplicants.forEach(id => {
    const pageNumber = m.get(id);
    if (pageNumber) {
      selectedPages.add(pageNumber);
    }
  });

  let selectedData;
  if (selectedPages.size > 1) {
    // If selected data spans multiple pages, use allData
    selectedData = allData; // or however you want to define this data
  } else if (selectedApplicants.length > 0) {
    // If there are selected applicants, filter based on those
    selectedData = allData1.filter((row, index) => selectedApplicants.includes(applicants[index].applyjobid));
  } else {
    // Default to allData
    selectedData = allData;
  }
 
  selectedData.unshift(capitalizedHeaders);
 
  const csvContent = selectedData.map(row => row.join(',')).join('\n');
 
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'applicants.csv';
 
  link.click();
};
   
 
   
    return (
      <div className="dashboard__content">
        <section className="page-title-dashboard">
        <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ marginBottom: "-5px" }}>
            <button
                className="export-buttonn"
                onClick={exportCSV}
                style={{
                  position: "absolute",
                  right: "0",
                  marginRight: "200px",
                  top: "180px",
                  zIndex: 2, // Higher z-index to keep button on top
                }}
            >
                ExportCSV
            </button>
            </div>
            
            <select
              className="status-select"
              value={selectedStatus || ""}
              onChange={handleSelectChange}
              onFocus={(e) => (e.target.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.2)")}
              onBlur={(e) => (e.target.style.boxShadow = "none")}
              style={{
                position: "absolute",
                right: "0",
                marginRight: "20px",
                top: "180px",
                marginBottom: "10px",
                zIndex: 1,
                padding: "10px", // Add padding for better spacing
                border: "1px solid #ccc", // Light border color
                borderRadius: "4px", // Rounded corner
                cursor: "pointer", // Pointer cursor for better UX
                transition: "border-color 0.3s, box-shadow 0.3s", // Transition for focus effect
              }}
            >
            <option value="" disabled hidden>
                Change Status
            </option>
            <option value="Screening">Screening</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
            </select>
            </div>
          <div className="themes-container">
            <div className="row">
              <div className="col-lg-9 col-md-9">
                <div className="title-dashboard">
                  
                  
                  <div className="title-dash flex2"><BackButton />All Applicants : <h5 className="title-dash flex2"> {count}</h5>
                 
                  </div>
                    {/* Filter icon button */}
                    <button
                    className="filter-icon-button"
                    onClick={() => setShowFilters(!showFilters)}
                    style={{ 
                      color: '#0A58CA', 
                      backgroundColor: 'transparent', 
                      border: 'none', 
                      cursor: 'pointer',
                      textDecoration: 'underline',  /* Adds underline to the text */
                      display: 'flex', 
                      position: 'absolute', 
                      alignItems: 'center',
                      paddingTop: '10px',
                      
                    }}
                  >
                    Filters
                    <img src={filtericon} className="external-link-image" style={{ marginLeft: '1px', height: '20px' }} />
                  </button>
                  <div className="row">
                    <div className="col-lg-12 col-md-12" style={{ display: 'flex', justifyContent: 'flex-end', paddingLeft:'900px' }}>
                      <div className="controls" style={{ display: 'flex', gap: '10px' }}>
                        {/* <button className="export-buttonn" onClick={exportCSV}>
                          ExportCSV
                        </button>
                        <select className="status-select" value={selectedStatus} onChange={handleSelectChange}>
                          <option value="" disabled>
                            Change Status
                          </option>
                          <option value="Screening">Screening</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interviewing">Interviewing</option>
                          <option value="Selected">Selected</option>
                          <option value="Rejected">Rejected</option>
                        </select> */}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              
            </div>
          </div>
        </section>
 
      

      <div className={`filter-menu ${showFilters ? 'show' : ''}`}>
      
        <div className="table-container">
        
              <h3 className="filter">
              
              <span
            style={{ cursor: 'pointer', marginRight: '16px', marginLeft: '-40px', position: 'relative'
            }} // Add pointer cursor for the arrow
            onClick={() => setShowFilters(!showFilters)} // Toggle filters visibility
          >
            <img src={arrowleft} style={{ height: '40px', width:'24px', marginTop: '7px' }} />
            </span>
             Filters </h3>
                
                {/* Filter section */}
                <div className="filter-option">
  <div className="checkbox-label">
    <input
      type="checkbox"
      id="nameFilter"
      checked={filterOptions.nameFilter}
      onChange={handleCheckboxChange}
      style={{ width: 'auto' }} 
    />
    <label className="label" htmlFor="nameFilter">Name</label>
  </div>
  {filterOptions.nameFilter && (
    <div className="filter-details">
      <div className="popup">
        <div className="dropdown-container1">
          <select
            id="nameFilterSelect"
            value={filterOptions.nameFilterSelect}
            onChange={handleSelectChange1}
          >
            <option value="is">is</option>
            <option value="contains">contains</option>
          </select>
        </div>
        {/* <input
          type="text"
          id="name"
          placeholder="Enter value"
          onChange={handleTextFieldChange}
          style={{ width: '100px', height: '20px' }}
        /> */}
                <Typeahead
                  id="name"  // Assign an ID to distinguish between inputs
                  onChange={(selected) => {
                    // Handle the case when a user selects an item
                    handleTextFieldChange("name", selected); 
                  }}
                  onInputChange={(text) => {
                    // Handle the case when a user is typing
                    handleTextFieldChange("name", text);
                  }}
                  options={availableNameSuggestions}  // Options for typeahead
                  placeholder="Type to search..."
                />
                        
                      </div>
                    </div>
                  )}
                 </div>

                    <div className="filter-option">
                      <div className="checkbox-label">
                        <input
                          type="checkbox"
                          id="emailFilter"
                          checked={filterOptions.emailFilter}
                          onChange={handleCheckboxChange}
                        />
                        <label className="label" htmlFor="emailFilter">Email</label>
                      </div>
                      {filterOptions.emailFilter && (
                        <div className="filter-details">
                          <div className="popup">
                          <div className="dropdown-container1">
                            <select
                              id="emailFilterSelect"
                              value={filterOptions.emailFilterSelect}
                              onChange={handleSelectChange1}
                            >
                              <option value="is">is</option>
                              <option value="contains">contains</option>
                            </select>
                          </div>
                          {/* <input
                            type="text"
                            id="email"
                            placeholder="Enter value"
                            onChange={handleTextFieldChange}
                            style={{ width: '100px', height: '20px' }}
                          /> */}
                          <Typeahead
                            id="email"  // Assign an ID to distinguish between inputs
                            onChange={(selected) => {
                              // Handle the case when a user selects an item
                              handleTextFieldChange("email", selected); 
                            }}
                            onInputChange={(text) => {
                              // Handle the case when a user is typing
                              handleTextFieldChange("email", text);
                            }}
                            options={availableEmailSuggestions}  // Options for typeahead
                            placeholder="Type to search..."
                          />
                        </div>
                        </div>
                      )}
                    </div>


                    <div className="filter-option">
                      <div className="checkbox-label">
                        <input
                          type="checkbox"
                          id="mobileFilter"
                          checked={filterOptions.mobileFilter}
                          onChange={handleCheckboxChange}
                        />
                        <label className="label" htmlFor="mobileFilter">Mobile Number</label>
                      </div>
                      {filterOptions.mobileFilter && (
                        <div className="filter-details">
                          <div className="popup">
                          <div className="dropdown-container1">
                            <select
                              id="mobileFilterSelect"
                              value={filterOptions.mobileFilterSelect}
                              onChange={handleSelectChange1}
                            >
                              <option value="is">is</option>
                              <option value="contains">contains</option>
                            </select>
                          </div>
                          {/* <input
                            type="text"
                            id="mobileNumber"
                            placeholder="Enter value"
                            onChange={handleTextFieldChange}
                            style={{ width: '100px', height: '20px' }}
                          /> */}
                          <Typeahead
                            id="mobileNumber"  // Assign an ID to distinguish between inputs
                            onChange={(selected) => {
                              // Handle the case when a user selects an item
                              handleTextFieldChange("mobileNumber", selected); 
                            }}
                            onInputChange={(text) => {
                              // Handle the case when a user is typing
                              handleTextFieldChange("mobileNumber", text);
                            }}
                            options={availableMobileSuggestions}  // Options for typeahead
                            placeholder="Type to search..."
                          />
                        </div>
                        </div>
                      )}
                    </div>

                    <div className="filter-option">
                      <div className="checkbox-label">
                        <input
                          type="checkbox"
                          id="jobFilter"
                          checked={filterOptions.jobFilter}
                          onChange={handleCheckboxChange}
                        />
                        <label className="label" htmlFor="jobFilter">&nbsp;Job Title</label>
                      </div>
                      {filterOptions.jobFilter && (
                        <div className="filter-details">
                          <div className="popup">
                          <div className="dropdown-container1">
                            <select
                              id="jobFilterSelect"
                              value={filterOptions.jobFilterSelect}
                              onChange={handleSelectChange1}
                            >
                              <option value="is">is</option>
                              <option value="contains">contains</option>
                            </select>
                          </div>
                          {/* <input
                            type="text"
                            id="jobTitle"
                            placeholder="Enter value"
                            onChange={handleTextFieldChange}
                            style={{ width: '100px', height: '20px' }}
                          /> */}
                          <Typeahead
                            id="jobTitle"  // Assign an ID to distinguish between inputs
                            onChange={(selected) => {
                              // Handle the case when a user selects an item
                              handleTextFieldChange("jobTitle", selected); 
                            }}
                            onInputChange={(text) => {
                              // Handle the case when a user is typing
                              handleTextFieldChange("jobTitle", text);
                            }}
                            options={availableJobTitleSuggestions}  // Options for typeahead
                            placeholder="Type to search..."
                          />
                        </div>
                        </div>
                      )}
                    </div>

                    <div className="filter-option">
                      <div className="checkbox-label">
                        <input
                          type="checkbox"
                          id="statusFilter"
                          checked={filterOptions.statusFilter}
                          onChange={handleCheckboxChange}
                        />
                        <label className="label" htmlFor="statusFilter">&nbsp;Application Status</label>
                      </div>
                      {filterOptions.statusFilter && (
                        <div className="filter-details">
                          <div className="popup">
                          <div className="dropdown-container1">
                            {/* <select
                              id="statusFilterSelect"
                              value={filterOptions.statusFilterSelect}
                              onChange={handleSelectChange1}
                            >
                              <option value="is">is</option>
                              <option value="contains">contains</option>
                            </select> */}
                          </div>
                          {/* <input
                            type="text"
                            id="applicantStatus"
                            placeholder="Enter value"
                            onChange={handleTextFieldChange}
                            style={{ width: '100px', height: '20px' }}
                          /> */}
                          <Typeahead
                            id="applicantStatus"  // Assign an ID to distinguish between inputs
                            onChange={(selected) => {
                              // Handle the case when a user selects an item
                              handleTextFieldChange("applicantStatus", selected); 
                            }}
                            onInputChange={(text) => {
                              // Handle the case when a user is typing
                              handleTextFieldChange("applicantStatus", text);
                            }}
                            options={validStatusSuggestions}  // Options for typeahead
                            placeholder="Type to search..."
                          />
                        </div>
                        </div>
                      )}
                    </div>

                    <div className="filter-option">
                      <div className="checkbox-label">
                        <input
                          type="checkbox"
                          id="preScreenedCondition"
                          checked={filterOptions.preScreenedCondition}
                          onChange={handleCheckboxChange}
                        />
                        <label className="label" htmlFor="preScreenedCondition">&nbsp;Pre-screened</label>
                      </div>
                    </div>

                     
                    {selectedColumns.includes("Experience")&&
                    <div className="filter-option">
                      <div className="checkbox-label">
                        <input
                          type="checkbox"
                          id="experienceFilter"
                          checked={filterOptions.experienceFilter}
                          onChange={handleCheckboxChange}
                        />
                        <label className="label" htmlFor="experienceFilter">&nbsp;Experience</label>
                      </div>
                      {filterOptions.experienceFilter && (
                        <div className="filter-details">
                          <div className="popup">
                          <div className="dropdown-container1">
                            <select
                              id="experienceFilterSelect"
                              value={filterOptions.experienceFilterSelect}
                              onChange={handleSelectChange1}
                            >
                              <option value="is">is</option>
                              <option value="greaterThan">greaterThan</option>
                              <option value="lessThan">lessThan</option>
                            </select>
                          </div>
                          {/* <input
                            type="text"
                            id="minimumExperience"
                            placeholder="Enter value"
                            onChange={handleTextFieldChange}
                            style={{ width: '100px', height: '20px' }}
                          /> */}
                          <Typeahead
                            id="minimumExperience"  // Assign an ID to distinguish between inputs
                            onChange={(selected) => {
                              // Handle the case when a user selects an item
                              handleTextFieldChange("minimumExperience", selected); 
                            }}
                            onInputChange={(text) => {
                              // Handle the case when a user is typing
                              handleTextFieldChange("minimumExperience", text);
                            }}
                            options={availableExpSuggestions}  // Options for typeahead
                            placeholder="Type to search..."
                          />
                        </div>
                        </div>
                      )}
                    </div>}

                    {selectedColumns.includes("Qualification")&&
                    <div className="filter-option">
                      <div className="checkbox-label">
                        <input
                          type="checkbox"
                          id="minimumQualification"
                          checked={filterOptions.minimumQualification}
                          onChange={handleCheckboxChange}
                        />
                        <label className="label" htmlFor="minimumQualification">&nbsp;Qualification</label>
                      </div>
                      {filterOptions.minimumQualification && (
                        <div className="filter-details">
                          <div className="popup">
                          <div className="dropdown-container1">
                            <select
                              id="minimumQualificationSelect"
                              value={filterOptions.minimumQualificationSelect}
                              onChange={handleSelectChange1}
                            >
                              <option value="is">is</option>
                              <option value="contains">contains</option>
                            </select>
                          </div>
                          {/* <input
                            type="text"
                            id="minimumQualificationInput"
                            placeholder="Enter value"
                            onChange={handleTextFieldChange}
                            style={{ width: '100px', height: '20px' }}
                          /> */}
                          <Typeahead
                            id="minimumQualificationInput"  // Assign an ID to distinguish between inputs
                            onChange={(selected) => {
                              // Handle the case when a user selects an item
                              handleTextFieldChange("minimumQualificationInput", selected); 
                            }}
                            onInputChange={(text) => {
                              // Handle the case when a user is typing
                              handleTextFieldChange("minimumQualificationInput", text);
                            }}
                            options={availableQualSuggestions}  // Options for typeahead
                            placeholder="Type to search..."
                          />
                        </div>
                        </div>
                      )}
                    </div>}

                    {selectedColumns.includes("Speclization")&&
                    <div className="filter-option">
                      <div className="checkbox-label">
                        <input
                          type="checkbox"
                          id="specialization"
                          checked={filterOptions.specialization}
                          onChange={handleCheckboxChange}
                        />
                        <label className="label" htmlFor="specialization">&nbsp;Specialization</label>
                      </div>
                      {filterOptions.specialization && (
                        <div className="filter-details">
                          <div className="popup">
                          <div className="dropdown-container1">
                            <select
                              id="specializationSelect"
                              value={filterOptions.specializationSelect}
                              onChange={handleSelectChange1}
                            >
                              <option value="is">is</option>
                              <option value="contains">contains</option>
                            </select>
                          </div>
                          {/* <input
                            type="text"
                            id="specializationInput"
                            placeholder="Enter value"
                            onChange={handleTextFieldChange}
                            style={{ width: '100px', height: '20px' }}
                          /> */}
                          <Typeahead
                            id="specializationInput"  // Assign an ID to distinguish between inputs
                            onChange={(selected) => {
                              // Handle the case when a user selects an item
                              handleTextFieldChange("specializationInput", selected); 
                            }}
                            onInputChange={(text) => {
                              // Handle the case when a user is typing
                              handleTextFieldChange("specializationInput", text);
                            }}
                            options={availableSpecSuggestions}  // Options for typeahead
                            placeholder="Type to search..."
                          />
                        </div>
                        </div>
                      )}
                    </div>}

                    {selectedColumns.includes("Apptitude Score")&&
                    <div className="filter-option">
                      <div className="checkbox-label">
                        <input
                          type="checkbox"
                          id="apptitudeScore"
                          checked={filterOptions.apptitudeScore}
                          onChange={handleCheckboxChange3}
                        />
                        <label className="label" htmlFor="apptitudeScore">&nbsp;Aptitude score</label>
                      </div>
                      {filterOptions.apptitudeScore && (
                        <div className="filter-details">
                          <div className="popup">
                          <div className="dropdown-container1">
                            <select
                              id="apptitudeScoreFilterSelect"
                              value={filterOptions.apptitudeScoreFilterSelect}
                              onChange={handleSelectChange1}
                            >
                              <option value="ascending">Ascending</option>
                              <option value="descending">Descending</option>
                            </select>
                          </div>
                          {/* <input
                            type="text"
                            id="apptitudeScoreInput"
                            placeholder="Enter value"
                            onChange={handleTextFieldChange}
                            style={{ width: '100px', height: '20px' }}
                          /> */}
                          {/* <Typeahead
                            id="apptitudeScoreInput"  // Assign an ID to distinguish between inputs
                            onChange={(selected) => {
                              // Handle the case when a user selects an item
                              handleTextFieldChange("apptitudeScoreInput", selected); 
                            }}
                            onInputChange={(text) => {
                              // Handle the case when a user is typing
                              handleTextFieldChange("apptitudeScoreInput", text);
                            }}
                            options={validAptiSuggestions}  // Options for typeahead
                            placeholder="Type to search..."
                          /> */}
                        </div>
                        </div>
                      )}
                    </div>}

                    {selectedColumns.includes("Technical Score")&&
                    <div className="filter-option">
                      <div className="checkbox-label">
                        <input
                          type="checkbox"
                          id="technicalScore"
                          checked={filterOptions.technicalScore}
                          onChange={handleCheckboxChange3}
                        />
                        <label className="label" htmlFor="technicalScore">&nbsp;Technical score</label>
                      </div>
                      {filterOptions.technicalScore && (
                        <div className="filter-details">
                          <div className="popup">
                          <div className="dropdown-container1">
                            <select
                              id="technicalScoreFilterSelect"
                              value={filterOptions.technicalScoreFilterSelect}
                              onChange={handleSelectChange1}
                            >
                              <option value="ascending">Ascending</option>
                              <option value="descending">Descending</option>
                            </select>
                          </div>
                          {/* <input
                            type="text"
                            id="technicalScoreInput"
                            placeholder="Enter value"
                            onChange={handleTextFieldChange}
                            style={{ width: '100px', height: '20px' }}
                          /> */}
                          {/* <Typeahead
                            id="technicalScoreInput"  // Assign an ID to distinguish between inputs
                            onChange={(selected) => {
                              // Handle the case when a user selects an item
                              handleTextFieldChange("technicalScoreInput", selected); 
                            }}
                            onInputChange={(text) => {
                              // Handle the case when a user is typing
                              handleTextFieldChange("technicalScoreInput", text);
                            }}
                            options={validTeciSuggestions}  // Options for typeahead
                            placeholder="Type to search..."
                          /> */}
                        </div>
                        </div>
                      )}
                    </div>}
                     
                    {selectedColumns.includes("Job Match%")&&
                    <div className="filter-option">
                      <div className="checkbox-label">
                        <input
                          type="checkbox"
                          id="matchPercentage"
                          checked={filterOptions.matchPercentage}
                          onChange={handleCheckboxChange3}
                        />
                        <label className="label" htmlFor="matchPercentage">&nbsp; Job Match %</label>
                      </div>
                      {filterOptions.matchPercentage && (
                        <div className="filter-details">
                          <div className="popup">
                          <div className="dropdown-container1">
                            <select
                              id="matchPercentageFilterSelect"
                              value={filterOptions.matchPercentageFilterSelect}
                              onChange={handleSelectChange1}
                            >
                              
                                <option value="ascending">Ascending</option>
                                <option value="descending">Descending</option>
                              
                            </select>
                          </div>
                          {/* <input
                            type="text"
                            id="technicalScoreInput"
                            placeholder="Enter value"
                            onChange={handleTextFieldChange}
                            style={{ width: '100px', height: '20px' }}
                          /> */}
                          {/* <Typeahead
                            id="matchPercentageInput"  // Assign an ID to distinguish between inputs
                            onChange={(selected) => {
                              // Handle the case when a user selects an item
                              handleTextFieldChange("matchPercentageInput", selected); 
                            }}
                            onInputChange={(text) => {
                              // Handle the case when a user is typing
                              handleTextFieldChange("matchPercentageInput", text);
                            }}
                            options={validJobMatchSuggestions}  // Options for typeahead
                            placeholder="Type to search..."
                          /> */}
                        </div>
                        </div>
                      )}
                    </div>}

                    {selectedColumns.includes("Matching Skills")&&
                    <div className="filter-option">
                      <div className="checkbox-label">
                        <input
                          type="checkbox"
                          id="matchedSkills"
                          checked={filterOptions.matchedSkills}
                          onChange={handleCheckboxChange}
                        />
                        <label className="label" htmlFor="matchedSkills">&nbsp;Matching skills</label>
                      </div>
                      {filterOptions.matchedSkills && (
                        <div className="filter-details">
                          <div className="popup">
                          <div className="dropdown-container1">
                            <select
                              id="matchedSkillsFilterSelect"
                              value={filterOptions.matchedSkillsFilterSelect}
                              onChange={handleSelectChange1}
                            >
                              <option value="is">is</option>
                              <option value="contains">contains</option>
                              
                            </select>
                          </div>
                          {/* <input
                            type="text"
                            id="technicalScoreInput"
                            placeholder="Enter value"
                            onChange={handleTextFieldChange}
                            style={{ width: '100px', height: '20px' }}
                          /> */}
                          <Typeahead
                            id="matchedSkillsInput"  // Assign an ID to distinguish between inputs
                            onChange={(selected) => {
                              // Handle the case when a user selects an item
                              handleTextFieldChange("matchedSkillsInput", selected); 
                            }}
                            onInputChange={(text) => {
                              // Handle the case when a user is typing
                              handleTextFieldChange("matchedSkillsInput", text);
                            }}
                            options={validJobMatchSkillSuggestions}  // Options for typeahead
                            placeholder="Type to search..."
                          />
                        </div>
                        </div>
                      )}
                    </div>}
                    
                    {selectedColumns.includes("Missing Skills")&&
                    <div className="filter-option">
                      <div className="checkbox-label">
                        <input
                          type="checkbox"
                          id="nonMatchedSkills"
                          checked={filterOptions.nonMatchedSkills}
                          onChange={handleCheckboxChange}
                        />
                        <label className="label" htmlFor="nonMatchedSkills">&nbsp;Missing skills</label>
                      </div>
                      {filterOptions.nonMatchedSkills && (
                        <div className="filter-details">
                          <div className="popup">
                          <div className="dropdown-container1">
                            <select
                              id="nonMatchedSkillsFilterSelect"
                              value={filterOptions.nonMatchedSkillsFilterSelect}
                              onChange={handleSelectChange1}
                            >
                              <option value="is">is</option>
                              <option value="contains">contains</option>
                              
                            </select>
                          </div>
                          {/* <input
                            type="text"
                            id="technicalScoreInput"
                            placeholder="Enter value"
                            onChange={handleTextFieldChange}
                            style={{ width: '100px', height: '20px' }}
                          /> */}
                          <Typeahead
                            id="nonMatchedSkillsInput"  // Assign an ID to distinguish between inputs
                            onChange={(selected) => {
                              // Handle the case when a user selects an item
                              handleTextFieldChange("nonMatchedSkillsInput", selected); 
                            }}
                            onInputChange={(text) => {
                              // Handle the case when a user is typing
                              handleTextFieldChange("nonMatchedSkillsInput", text);
                            }}
                            options={validNonMatchSkillSuggestions}  // Options for typeahead
                            placeholder="Type to search..."
                          />
                        </div>
                        </div>
                      )}
                    </div>}
            
                    {selectedColumns.includes("Additional Skills")&&
                    <div className="filter-option">
                      <div className="checkbox-label">
                        <input
                          type="checkbox"
                          id="additionalSkills"
                          checked={filterOptions.additionalSkills}
                          onChange={handleCheckboxChange}
                        />
                        <label className="label" htmlFor="additionalSkills">&nbsp;Additional skills</label>
                      </div>
                      {filterOptions.additionalSkills && (
                        <div className="filter-details">
                          <div className="popup">
                          <div className="dropdown-container1">
                            <select
                              id="additionalSkillsFilterSelect"
                              value={filterOptions.additionalSkillsFilterSelect}
                              onChange={handleSelectChange1}
                            >
                              <option value="is">is</option>
                              <option value="contains">contains</option>
                              
                            </select>
                          </div>
                          {/* <input
                            type="text"
                            id="technicalScoreInput"
                            placeholder="Enter value"
                            onChange={handleTextFieldChange}
                            style={{ width: '100px', height: '20px' }}
                          /> */}
                          <Typeahead
                            id="additionalSkillsInput"  // Assign an ID to distinguish between inputs
                            onChange={(selected) => {
                              // Handle the case when a user selects an item
                              handleTextFieldChange("additionalSkillsInput", selected); 
                            }}
                            onInputChange={(text) => {
                              // Handle the case when a user is typing
                              handleTextFieldChange("additionalSkillsInput", text);
                            }}
                            options={validAdditonalSkillSuggestions}  // Options for typeahead
                            placeholder="Type to search..."
                          />
                        </div>
                        </div>
                      )}
                    </div>}
                    
                    {selectedColumns.includes("Tested Skills")&&
                    <div className="filter-option">
                      <div className="checkbox-label">
                        <input
                          type="checkbox"
                          id="applicantSkillBadges"
                          checked={filterOptions.applicantSkillBadges}
                          onChange={handleCheckboxChange}
                        />
                        <label className="label" htmlFor="applicantSkillBadges">&nbsp;Tested skills</label>
                      </div>
                      {filterOptions.applicantSkillBadges && (
                        <div className="filter-details">
                          <div className="popup">
                          <div className="dropdown-container1">
                            <select
                              id="applicantSkillBadgesFilterSelect"
                              value={filterOptions.applicantSkillBadgesFilterSelect}
                              onChange={handleSelectChange1}
                            >
                              <option value="is">is</option>
                              <option value="contains">contains</option>
                              
                            </select>
                          </div>
                          {/* <input
                            type="text"
                            id="technicalScoreInput"
                            placeholder="Enter value"
                            onChange={handleTextFieldChange}
                            style={{ width: '100px', height: '20px' }}
                          /> */}
                          <Typeahead
                            id="applicantSkillBadgesInput"  // Assign an ID to distinguish between inputs
                            onChange={(selected) => {
                              // Handle the case when a user selects an item
                              handleTextFieldChange("applicantSkillBadgesInput", selected); 
                            }}
                            onInputChange={(text) => {
                              // Handle the case when a user is typing
                              handleTextFieldChange("applicantSkillBadgesInput", text);
                            }}
                            options={validSkillBadgesSuggestions}  // Options for typeahead
                            placeholder="Type to search..."
                          />
                        </div>
                        </div>
                      )}
                    </div>}
 
                    {selectedColumns.includes("Location")&&
                    <div className="filter-option">
                      <div className="checkbox-label">
                        <input
                          type="checkbox"
                          id="preferredJobLocations"
                          checked={filterOptions.preferredJobLocations}
                          onChange={handleCheckboxChange}
                        />
                        <label className="label" htmlFor="preferredJobLocations">&nbsp;Preferred-location</label>
                      </div>
                      {filterOptions.preferredJobLocations && (
                        <div className="filter-details">
                          <div className="popup">
                          <div className="dropdown-container1">
                            <select
                              id="preferredJobLocationsFilterSelect"
                              value={filterOptions.preferredJobLocationsFilterSelect}
                              onChange={handleSelectChange1}
                            >
                              <option value="is">is</option>
                              <option value="contains">contains</option>
                              
                            </select>
                          </div>
                          {/* <input
                            type="text"
                            id="technicalScoreInput"
                            placeholder="Enter value"
                            onChange={handleTextFieldChange}
                            style={{ width: '100px', height: '20px' }}
                          /> */}
                          <Typeahead
                            id="preferredJobLocationsInput"  // Assign an ID to distinguish between inputs
                            onChange={(selected) => {
                              // Handle the case when a user selects an item
                              handleTextFieldChange("preferredJobLocationsInput", selected); 
                            }}
                            onInputChange={(text) => {
                              // Handle the case when a user is typing
                              handleTextFieldChange("preferredJobLocationsInput", text);
                            }}
                            options={validPreferredLocSuggestions}  // Options for typeahead
                            placeholder="Type to search..."
                          />
                        </div>
                        </div>
                      )}
                    </div>}
                    
                    <div>
                      <button className="apply-button1" onClick={applyFilter}>Apply</button>
                      <button className="reset-button1" onClick={resetFilter}>Reset</button>
                      </div>
                    {/* Error message */}
      {showError && (
        <p style={{
          color: '#F83838',
          fontFamily: 'Plus Jakarta Sans',
          fontSize: '14px',
          fontWeight: '400',
          lineHeight: '25px',
          borderRadius: '8px',
          background: '#FFF2F2',
          padding: '10px',
          marginLeft: '-40px',
          textAlign:'center'
        }}>
          Please Select at least one filter
        </p>
      )}
              </div>
              
              </div>
              {showFilters && <div className="backdrop"></div>}
        <section className="flat-dashboard-setting bg-white">
          <div className="themes-container">

            <div className="row">
            
     
              <div className="col-lg-12 col-md-12">
                <div className="profile-setting">
                <div className="table-container-wrapper">
                  <div className="table-container">
                  { isLoading ? (
                  <div>Loading...</div> // Display a spinner or loading text
                      ) : Array.isArray(applicants) && applicants.length === 0 ? (
                  <p>No Applicants are available.</p> // Display when there are no applicants
                      ) : (
                    <table ref={tableref} className="responsive-table">
                      <thead id='tableHeader'>
                        <tr>
                          <th className='No'>
                            <input
                              type="checkbox"
                              onChange={handleSelectAll}
                              checked={selectedApplicants.length === currentRecords.length} 
                            />
                          </th>
                 
                          <th>Name</th>
                          <th>Email</th>
                          <th>Mobile Number</th>
                          <th>Job Title</th>
                          <th>Applicant Status</th>
                          {selectedColumns.map((column, index) => (
                            <th key={index}>
                              {column.replace(/([A-Z])/g, ' $1').trim()}
                            </th>
                          ))}
                          <th>
                            Resume
                          </th>
                          <th>
                          <div >
                            <button onClick={toggleSidebar} className="filter-button" style={{marginLeft:'-10px'}}>
                              {/* <FontAwesomeIcon icon={faSlidersH} style={{fontSize: '10px',width: '30px',height: '20px', color: 'gray',transform: 'rotate(180deg)'}}/>
                               */}
                               <i class="fa fa-sliders" aria-hidden="true"></i>
                            </button>
 
                            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                              <h3>
                                <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '20px', fontSize:'18px' }} onClick={toggleSidebar}/>
                                Manage Columns
                              </h3><br/>
                             
                              <ul style={{ marginLeft: '50px' }}>
                                {Object.keys(selectedCheckboxes).map((key, index) => (
                                  <li key={index} style={{ marginBottom: '10px', position: 'relative' }}>
                                    <input
                                      type="checkbox"
                                      name={key}
                                      checked={selectedCheckboxes[key]}
                                      onChange={handleCheckboxs}
                                    />
                                    <span>
                                      {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                              <div className='buttons'>
                              <button id="apply-button2" onClick={handleApply} className="apply-button2">Apply</button>
                              <div className="reset2-link" onClick={reset}>Reset</div>
                              </div>
                              {errorMessage && <h5 style={{ color: 'red', textAlign: 'center',marginLeft:'10px', marginTop: '50px' }}>{errorMessage}</h5>}
                            </div>
                            {isOpen && <div className="backdrop"></div>}
                          </div>
                          </th>
                          
                         
                         
                         
                        </tr>
                      </thead>
                      <tbody id="applicantTableBody">
                      {Array.isArray(currentRecords) && currentRecords.map((application,index) => (
                          <tr key={application.applyjobid} style={{
                            backgroundColor: selectedApplicants.includes(application.applyjobid)
                              ? "#F6F6F6"
                              : "transparent",
                          }}>
                           
                              <td>
                                <input
                                  type="checkbox"
                                  value={application.applyjobid}
                                  checked={selectedApplicants.includes(application.applyjobid)}
                                  onChange={() => handleCheckboxChange2(application.applyjobid)}
                                  name={`applicantCheckbox-${application.applyjobid}`}
                                />
                              </td>
                             
<td>
  <Link
    to={`/viewapplicant/${application.id}?jobid=${application.jobId}&appid=${application.id}`}
    style={{ color: '#0583D2', textDecoration: 'none', position: 'relative' }}
  >
    {application.name}

    {application.preScreenedCondition === 'PreScreened' && (
      <div style={{ display: 'inline-block', position: 'relative' }}>
        <img
          src={verified123}
          className="external-link-image"
          style={{
            marginLeft: '1px',
            width: '20px',
            height: '20.187px',
            flexShrink: 0
          }}
          onMouseEnter={() => setTooltipVisibleId(application.id)}  // Show tooltip for this applicant
          onMouseLeave={() => setTooltipVisibleId(null)}  // Hide tooltip on mouse leave
        />

        {/* Tooltip */}
        {tooltipVisibleId === application.id && (  // Only show tooltip if hovered
          <div
            style={{
              position: 'absolute',
              top: index === currentRecords.length - 1 ? '-60px' : '25px',
              left: '0',
              width: '600px',
              height: '62.226px',
              borderRadius: '8px',
              background: '#FFF',
              boxShadow: '0px 4px 15px 0px rgba(0, 0, 0, 0.15)',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              padding: '10px',
              boxSizing: 'border-box',
            }}
          >
            <img
              src={verified123}
              alt="Pre-screened badge"
              style={{
                width: '20px',
                height: '20.187px',
                marginRight: '20px',
                marginLeft: '5px',
              }}
            />
            <span style={{ whiteSpace: 'normal', color: 'black' }}>
              Pre-screened badges are issued to candidates who scored more than 70% in <br /> both Aptitude and Technical tests
            </span>
          </div>
        )}
      </div>
    )}
  </Link>
</td>

 
 
 
                            <td>
                            <Link to={`/viewapplicant/${application.id}?jobid=${application.jobId}&appid=${application.id}`} style={{ color: '#0583D2', textDecoration: 'none' }}>
                            {application.email}
  </Link>
  </td>
                       
                           
                            <td>
                            <Link to={`/viewapplicant/${application.id}?jobid=${application.jobId}&appid=${application.id}`} style={{ color: '#0583D2', textDecoration: 'none' }}>
                            {application.mobilenumber}
  </Link>
                              </td>
                            <td>{application.jobTitle}</td>
                            <td style={{
                                padding: '0px 10px', // Keep padding for the table cell
                                textAlign: 'center',  // Center content in the cell
                                verticalAlign: 'middle', // Align the content vertically in the middle
                              }}>
                                <div style={{
                                  display: 'inline-flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  gap: '10px',
                                  borderRadius: '14px',
                                  background: (() => {
                                    switch (application.applicantStatus) {
                                      case 'Shortlisted':
                                        return '#DBFAEB';
                                      case 'Selected':
                                        return '#F9F5FF';
                                      case 'Rejected':
                                        return '#FFF3F4';
                                      case 'Screening':
                                        return '#EFFFD0';
                                      case 'Interviewing':
                                        return '#FFF2E1';
                                      default:
                                        return '#F8F8F8'; // Default background for unknown status
                                    }
                                  })(),
                                  color: (() => {
                                    switch (application.applicantStatus) {
                                      case 'Shortlisted':
                                        return '#2D6A4F';
                                      case 'Selected':
                                        return '#6C3FB6';
                                      case 'Rejected':
                                        return '#FF4D4F';
                                      case 'Screening':
                                        return '#718F00';
                                      case 'Interviewing':
                                        return '#F7B267';
                                      default:
                                        return '#000'; // Default color for unknown status
                                    }
                                  })(),
                                  justifyContent: 'flex-start',
                                  padding: '0px 10px' // Add padding inside the content for spacing
                                }}>
                                  {application.applicantStatus}
                                </div>
                              </td>
 
                              {selectedColumns.includes("Experience")&&(<td>{application.experience}</td>)}
                            {selectedColumns.includes("Qualification")&&(<td>{application.minimumQualification}</td>)}
                            {selectedColumns.includes("Location")&&(
                              <td>
                              {application.preferredJobLocations.length > 3
                                ? `${application.preferredJobLocations.slice(0, 3).join(", ")} +`
                                : application.preferredJobLocations.join(", ")}
                              </td>)}
                            {selectedColumns.includes("Speclization")&&(<td>{application.specialization}</td>)}
                            {selectedColumns.includes("Apptitude Score") && (
                              <td>{application.apptitudeScore === 0 ? 'N/A' : application.apptitudeScore}</td>
                            )}
                            {selectedColumns.includes("Technical Score") && (
                              <td>{application.technicalScore === 0 ? 'N/A' : application.technicalScore}</td>
                            )}

                            {/* {selectedColumns.includes("Pre-Screened")&&<td>{application.preScreenedCondition}</td>} */}
                            {selectedColumns.includes("Matching Skills")&&(
                            <td>
                              {application.matchedSkills.length === 0
                              ? "N/A"
                              :application.matchedSkills.length > 3
                                ? `${application.matchedSkills.slice(0, 3).map(skill => skill.skillName).join(", ")} +`
                                : application.matchedSkills.map(skill => skill.skillName).join(", ")}
                            </td>
                            )}
                            {selectedColumns.includes("Missing Skills")&&(
                            <td>
                              {application.nonMatchedSkills.length === 0
                              ? "N/A"
                              :application.nonMatchedSkills.length > 3
                                ? `${application.nonMatchedSkills.slice(0, 3).map(skill => skill.skillName).join(", ")} +`
                                : application.nonMatchedSkills.map(skill => skill.skillName).join(", ")}
                            </td>
                            )}
                            {selectedColumns.includes("Additional Skills")&&(<td>
                              {application.additionalSkills.length === 0
                              ? "N/A"
                              :application.additionalSkills.length > 3
                                ? `${application.additionalSkills.slice(0, 3).map(skill => skill.skillName).join(", ")} +`
                                : application.additionalSkills.map(skill => skill.skillName).join(", ")}
                            </td>
                            )}
                            {selectedColumns.includes("Tested Skills")&&(<td>
                              {application.applicantSkillBadges && application.applicantSkillBadges.length > 3
                                ? `${application.applicantSkillBadges.slice(0, 3).map(skill => skill.skillBadge.name).join(", ")} +`
                                : application.applicantSkillBadges
                                  ? application.applicantSkillBadges.map(skill => skill.skillBadge.name).join(", ")
                                  : "N/A"}
                            </td>
                            )}
                           {selectedColumns.includes("Job Match%") && (
                              <td>{application.matchPercentage === 0 ? 'N/A' : `${application.matchPercentage}%`}</td>
                            )}

 
                            <td><Link to={`/view-resume/${application.id}`} style={{ color: 'blue' }}>View</Link></td>
                            <td></td>
                           
                          </tr>
                        ))}
                      </tbody>
                    </table>
                        )}
                  </div>
                </div>
                {applicants.length > 0 && FilterData.length === 0 && !appliedFilter &&(
                  <div className="pagination-controls">
                  <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                    Previous
                  </button>
                  <span>{currentPage}</span>
                  <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next
                  </button>
                </div>)}
                </div>
              </div>
            </div>
          </div>
        </section>

        {snackbar.open && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={handleCloseSnackbar}
          link={snackbar.link}
          linkText={snackbar.linkText}
        />
      )}
      </div>
    );
  }
  export default RecruiterAllApplicants;