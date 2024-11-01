import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import { apiUrl } from '../../services/ApplicantAPIService';
import { useUserContext } from '../common/UserProvider';
import { useParams } from 'react-router-dom';
import BackButton from '../common/BackButton';
import Mail from '../../images/icons/mail1.png';
import Phone from '../../images/icons/phone1.png';
import Resume from '../../images/icons/resume.png';
import mortarboard1 from '../../images/icons/mortarboard1.png';
import { useLocation, Link } from 'react-router-dom';
import Snackbar from '../common/Snackbar';
 
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};
 
 
const Recruiterviewapplicant = () => {
  const [profileData, setProfileData] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertShown, setAlertShown] = useState(false);
  const { user } = useUserContext();
  const { id } = useParams();
  const [resumeFileName, setResumeFileName] = useState('');
  const [jobs, setJobs] = useState([]);
  const [screeningQuestions, setScreeningQuestions] = useState([]);
  const [selectedApplicants, setSelectedApplicants] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedMenuOption, setSelectedMenuOption] = useState('All');
  const isMounted = useRef(true);
  const tableref=useRef(null);
  const filterRef = useRef([]);
  const [applicants, setApplicants] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', type: '' });
 
  const query = useQuery();
  const jobid = query.get('jobid');
  const  applicantId= query.get('appid');
 
  const fetchResume = async () => {
    try {
      console.log('Making resume API call...');
      const token = localStorage.getItem('jwtToken');
      const resumeResponse = await axios.get(`${apiUrl}/applicant/getResumeId/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include JWT token
        },
      });
      console.log('Resume API call response:', resumeResponse);
 
      if (resumeResponse.data) {
        const firstName = profileData?.basicDetails?.firstName || '';
        const lastName = profileData?.basicDetails?.lastName || '';
        const fileName = `${firstName}_${lastName}.pdf`;
        setResumeFileName(fileName);
      } else {
        console.error('No resume fileName found:', resumeResponse.data);
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
    }
  };
 
    fetchResume();
 
 
  const fetchActiveJob = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get(`${apiUrl}/job/${jobid}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include JWT token
        },
      });
      const job = response.data;
 
      if (job && job.screeningQuestions) {
        setScreeningQuestions(job.screeningQuestions);
      } else {
        setScreeningQuestions([]);
      }
 
      setLoading(false);
    } catch (error) {
      console.error('Error fetching job:', error);
      setLoading(false);
    }
  };
 
  useEffect(() => {
    if (jobid) {
      fetchActiveJob();
    }
  }, [jobid]);
 
  useEffect(() => {
    let isMounted = true;
 
    const fetchResume = async () => {
      try {
        console.log('Making resume API call...');
        const token = localStorage.getItem('jwtToken');

        const resumeResponse = await axios.get(`${apiUrl}/applicant/getResumeId/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include JWT token
          },
        });
        console.log('Resume API call response:', resumeResponse);
 
        if (resumeResponse.data) {
          const firstName = profileData?.basicDetails?.firstName || '';
          const lastName = profileData?.basicDetails?.lastName || '';
          const fileName = `${firstName}_${lastName}.pdf`;
          setResumeFileName(fileName);
        } else {
          console.error('No resume fileName found:', resumeResponse.data);
        }
      } catch (error) {
        console.error('Error fetching resume:', error);
      }
    };
 
      fetchResume();
   
 
    return () => {
      isMounted = false;
    };
  }, [id, profileData]);
 
 
  const handleResumeClick1 = async () => {
    try {
      const response = await axios.get(`${apiUrl}/resume/pdf/${id}`, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error fetching resume:', error);
    }
  };
 
  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', type: '' });
    window.location.reload();
  };
 
  const checkAndShowAlert = (message) => {
    const alertShownBefore = localStorage.getItem('alertShown');
 
    if (!alertShownBefore && !loading) {
      const userResponse = window.confirm(message);
      if (userResponse) {
        localStorage.setItem('alertShown', 'true');
        setAlertShown(true);
      }
    }
  };
 
  useEffect(() => {
    let count = 0;
    let profileResponse = null;
    let isMounted = true;
 
    const token = localStorage.getItem('jwtToken');
    const fetchData = async () => {
      try {
        profileResponse = await axios.get(`${apiUrl}/applicantprofile/${id}/profile-view1`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include JWT token
          },
        });
        // Sort skills once when setting the state
        const sortedSkills = profileResponse.data.skillsRequired.sort((a, b) => a.skillName.localeCompare(b.skillName));
        setProfileData({ ...profileResponse.data, skillsRequired: sortedSkills });
        count = 1;
 
        const imageResponse = await axios.get(`${apiUrl}/applicant-image/getphoto1/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
          },
          responseType: 'arraybuffer', // Set responseType to arraybuffer
        });
        
        const base64Image = btoa(
          new Uint8Array(imageResponse.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        );
        setImageSrc(`data:${imageResponse.headers['content-type']};base64,${base64Image}`);
 
        setLoading(false);
 
      } catch (error) {
        setLoading(false);
        if (count === 0 && isMounted) {
          window.alert('Profile not found. Please fill in your profile');
        }
      }
    };
 
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [user, id]);

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
       
       
        const message1 = `Status changed to <b>${newStatus}</b> for ${selectedApplicants.length} applicants`;
        setSnackbar({ open: true, message: message1, type: 'success' });
       
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
 
  if (loading) {
    return <div>Loading...</div>;
  }
 
  if (!profileData || alertShown) {
    return (
      <div>
        {!profileData && <p>Please fill in your bio data and upload a profile pic.</p>}
        {alertShown && <p>Alert already shown.</p>}
      </div>
    );
  }
 
  return (
    <div className="dashboard__content">
      <section className="page-title-dashboard">
        <div className="themes-container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="title-dashboard">
                <div className="title-dash flex2"><BackButton /> Applicants</div>
              </div>
            </div>
          </div>
        </div>
      </section>
 
     
      <section className="candidates-section">
        <div className="tf-container">
          <div className="row">
            <div className="col-lg-9">
            <section
      style={{
        marginTop: '-30px',
        marginBottom: '30px',
        borderRadius: '10px',
        padding: '30px',
        color: '#262626',
        backgroundColor: '#ffffff',
       
      }}>
        <div className="tf-container">
          <div className="wd-author-page-title">
            <div className="author-archive-header">
            <div
  style={{
    width: '80px',            
    height: '80px',            
    borderRadius: '50%',      
    overflow: 'hidden',        
    display: 'flex',          
    alignItems: 'center',
    justifyContent: 'center'
  }}
>
  <img
    src={imageSrc || '../images/user/avatar/profile-pic.png'}
    alt="Profile"
    onError={() => setImageSrc('../images/user/avatar/profile-pic.png')}
    style={{
      width: '100%',          
      height: '100%',          
      objectFit: 'cover'        
    }}
  />
</div>
 
              <div className="content" style={{marginLeft:'20px'}}>
               
              <h3 style={{ color: '#262626' }}>
  {profileData.basicDetails.firstName} {profileData.basicDetails.lastName}
</h3>
 
               
                <div style={{ color: '#262626', display: 'flex', alignItems: 'center' }}>
                  <img src={Mail} alt="Email" className="icon1" style={{ marginRight: '10px' }} />
                  {profileData.basicDetails.email}
                </div>
 
                <div style={{ color: '#262626', display: 'flex', alignItems: 'center' }}>
                  <img src={Phone} alt="Phone" className="icon1" style={{ marginRight: '10px' }} />
                  {profileData.basicDetails.alternatePhoneNumber}
                </div>
                  
              </div>
              
            </div>
            
            <div className="col-lg-12 col-md-12" style={{ display: 'flex', justifyContent: 'flex-end', paddingLeft:'450px' }}>
                      <div className="controls" style={{ display: 'flex', gap: '10px' }}>
                        <button className="export-buttonn">
                          Download PDF
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
                        </select>
                      </div>
                    </div>
          </div>
          
        </div>
      </section>
 
              <article className="job-article tf-tab single-job stc2">
                <div className="content-tab">
                  <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '30px', marginBottom: '30px' }}>
                    <div className="inner-content">
                      <div style={{ display: 'flex', alignItems: 'center',marginBottom:'10px' }}>
                        <span style={{marginLeft:'-10px',marginTop:'1px',width:'24px'}}>
                          <img src={mortarboard1} alt="mortarboard1" className="icon-prof" />
                        </span>
                        <span style={{
                          color: '#F97316',
                          marginLeft: '-1px',
                          fontSize: '16px',
                          fontWeight: '700',
                          lineHeight: '28px',
                          fontStyle: 'normal',
                          fontFamily: 'Plus Jakarta Sans'
                        }}>
                          Professional Details
                        </span>
                      </div>
 
                      <div className="group-infor">
                        <div className="inner">
                          <div className="row">
                            <div className="col">
                              <div className="subtitle-1 fw-7">
                                <span style={{marginLeft: '-40px',marginTop:'10px',color:'#A1A1A1',fontSize:'16px',fontWeight:'500',fontFamily:'Plus Jakarta Sans',fontStyle:'normal'}}>Qualification<br /></span>
                                <span style={{ fontWeight: 'bold', color: 'black', marginLeft: '-40px' }}>
                                  {profileData.qualification}
                                </span>
                              </div>
                            </div>
                            <div style={{marginTop:'20px'}}>
                              <div className="subtitle-2 fw-7">
                                <span style={{marginLeft: '-40px',marginTop:'20px',color:'#A1A1A1',fontSize:'16px',fontWeight:'500',fontFamily:'Plus Jakarta Sans',fontStyle:'normal'}}>Specialization<br /></span>
                                <span style={{ fontWeight: 'bold', color: 'black', marginLeft: '-40px'}}>
                                  {profileData.specialization}
                                </span>
                              </div>
                            </div>
                            <span style={{ marginLeft: '-40px',marginTop:'20px',color:'#A1A1A1',fontSize:'16px',fontWeight:'500',fontFamily:'Plus Jakarta Sans',fontStyle:'normal'}}>Skills</span>
                            <ul className="skills-list1" >
                              {profileData.skillsRequired && profileData.skillsRequired.map((skill, index) => (
                                <React.Fragment key={skill.id}>
                                  <li
                                    style={{
                                      marginRight: '10px',
                                      backgroundColor: '#334584',
                                      borderRadius: '24px',
                                      padding: '5px 15px',
                                      marginBottom:'5px'
                                     
                                    }}
                                  >
                                    <a>{skill.skillName}</a>
                                  </li>
                                  {index < profileData.skillsRequired.length - 1 && ""}
                                </React.Fragment>
                              ))}
                            </ul>
                           
                            <div style={{marginTop:'20px'}}>
                            <span style={{marginLeft: '-40px',marginTop:'10px',color:'#A1A1A1',fontSize:'16px',fontWeight:'500',fontFamily:'Plus Jakarta Sans',fontStyle:'normal',marginTop:'10px' }}>Experience In Years</span>
                            <div className="detail" style={{fontSize:'16px', marginLeft: '-40px', fontWeight: 'bold', color: 'black' }}>
                              {profileData.experience}
                            </div>
                            </div>
                           
                            <div style={{marginTop:'20px'}}>
                            <span style={{marginLeft: '-40px',marginTop:'10px',color:'#A1A1A1',fontSize:'16px',fontWeight:'500',fontFamily:'Plus Jakarta Sans',fontStyle:'normal',marginTop:'10px' }}>Preferred Job Locations</span>
                            <div className="detail" style={{ fontSize:'16px',marginLeft: '-40px', fontWeight: 'bold', color: 'black' }}>
                              {profileData.preferredJobLocations && profileData.preferredJobLocations.map((location, index) => (
                                <span key={index}>
                                  {location}
                                  {index !== profileData.preferredJobLocations.length - 1 && ', '}
                                </span>
                              ))}
                              {(profileData.basicDetails && profileData.basicDetails.city) || ''}
                            </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
 
                <div>
                <div>
 
                <div className="author-archive-footer" style={{
                  backgroundColor: 'white',
                  marginTop: '10px',
                  borderRadius: '10px',
                  padding: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center'}}>
                    <span style={{marginTop:'-35px' }}>
                      <img src={Resume} alt="Resume" className="icon-prof" style={{ marginRight: '10px' }} />
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', marginRight: '10px' }}>
                      <h5 style={{ color: '#F97316', fontSize: '16px', padding: '5px', fontWeight: 'bold',marginLeft:'-10px',marginBottom:'10px'}}>
                        Resume
                      </h5>
                      <div > <span style={{ cursor: 'pointer' }}  className="file-name-input-resume1" onClick={handleResumeClick1}>{resumeFileName}</span></div>
                    </div>
                  </div>
                </div>
               
  {/* Check if there are screening questions */}
  {screeningQuestions && screeningQuestions.length > 0 && (
    <div
      className="author-archive-footer"
      style={{
        backgroundColor: 'white',
        marginTop: '30px',
        borderRadius: '10px',
        padding: '15px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <span style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="31"
            height="31"
            viewBox="0 0 21 21"
            fill="none"
            className="icon-prof"
            style={{ marginRight: '10px' }}
          >
            <g clipPath="url(#clip0_2074_2568)">
              <path
                d="M10.0731 18.9733C14.6755 18.9733 18.4064 15.2423 18.4064 10.64C18.4064 6.0376 14.6755 2.30664 10.0731 2.30664C5.47071 2.30664 1.73975 6.0376 1.73975 10.64C1.73975 15.2423 5.47071 18.9733 10.0731 18.9733Z"
                stroke="#F97316"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.64844 8.1411C7.84436 7.58416 8.23106 7.11452 8.74007 6.81538C9.24907 6.51623 9.84752 6.40688 10.4294 6.50669C11.0113 6.6065 11.5391 6.90904 11.9193 7.36071C12.2996 7.81238 12.5077 8.38403 12.5068 8.97443C12.5068 10.6411 10.0068 11.4744 10.0068 11.4744"
                stroke="#F97316"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.0732 14.8066H10.0816"
                stroke="#F97316"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_2074_2568">
                <rect
                  width="30"
                  height="30"
                  fill="white"
                  transform="translate(0.0732422 0.640625)"
                />
              </clipPath>
            </defs>
          </svg>
        </span>
        <div
          style={{ display: 'flex', flexDirection: 'column', marginRight: '10px' }}
        >
          <h5
            style={{
              color: '#F97316',
              fontSize: '16px',
              padding: '5px',
              fontWeight: 'bold',
              marginLeft: '-10px',
              marginBottom: '10px'
            }}
          >
            Screening Questions
          </h5>
          {screeningQuestions.map(question => (
            <div key={question.id} className="subtitle-2 fw-7"
            style={{ marginBottom: '20px' }}>
              <span
                style={{
                  marginLeft: '0px',
                  marginTop: '20px',
                  color: 'black',
                  fontSize: '16px',
                  fontWeight: '800',
                  fontFamily: 'Plus Jakarta Sans',
                  fontStyle: 'normal'
                }}
              >
                {question.questionText}
                <br />
              </span>
              {question.answers.map((answer, index) => (
  answer.applicant.id == applicantId? (
    <span
      key={index}
      style={{
        fontWeight: 'bold',
        color: '#686666',
        fontSize: '15px',
        fontWeight: '400',
        
      }}
    >
      {answer.answerText}
      <br />
    </span>
  ) : null
))}
 
            </div>
          ))}
        </div>
      </div>
    </div>
  )}
</div>
 
    </div>
 
               
              </article>
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
};
 
export default Recruiterviewapplicant;